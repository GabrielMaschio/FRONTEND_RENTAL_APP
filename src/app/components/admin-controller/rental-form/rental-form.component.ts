import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RentalService } from '../service/rental.service';
import { CarService } from '../service/car.service';
import { ClientService } from '../service/client.service';
import { ToastrService } from 'ngx-toastr';
import { Car } from '../types/car.types';
import { Cliente } from '../types/client.types';
import { Rental } from '../types/rental.type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rental-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './rental-form.component.html',
  styleUrls: ['./rental-form.component.scss']
})
export class RentalFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rentalService = inject(RentalService);
  private carService = inject(CarService);
  private clientService = inject(ClientService);
  private toastrService = inject(ToastrService);

  cars: Car[] = [];
  clients: Cliente[] = [];

  rentalForm: FormGroup = this.fb.group({
    customer_fk: [null, [Validators.required]],
    car_fk: [null, [Validators.required]],
    start_date: [{ value: '', disabled: true }, [Validators.required]],
    end_date: [{ value: '', disabled: true }, [Validators.required]],
    rental_days: [{ value: 0, disabled: true }],
    total_price: [0],
    status: [true, [Validators.required]]
  });

  isEditMode = false;

  ngOnInit(): void {
    this.loadCars();
    this.loadClients();
    this.setupCarValidation();
    this.setupDateValidation();
    this.calculateTotalAmount();

    const rentalId = this.route.snapshot.params['id'];
    if (rentalId) {
      this.isEditMode = true;
      this.rentalService.getRentalById(rentalId).subscribe((rental: Rental) => {
        this.rentalForm.get('start_date')?.enable();
        this.rentalForm.get('end_date')?.enable();

        this.rentalForm.patchValue({
          customer_fk: rental.customer.customer_id,
          car_fk: rental.car.car_id,
          start_date: new Date(rental.start_date).toISOString().split('T')[0],
          end_date: new Date(rental.end_date).toISOString().split('T')[0],
          status: rental.status
        });
      });
    }
  }

  private loadCars(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        console.log('Carros carregados:', {
          totalCarros: cars.length,
          carros: cars.map(car => ({
            id: car.car_id,
            modelo: car.name
          }))
        });
      },
      error: (error) => {
        console.error('Erro ao carregar carros:', error);
        this.toastrService.error('Erro ao carregar carros');
      }
    });
  }

  private loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.toastrService.error('Erro ao carregar clientes');
      }
    });
  }

  private setupDateValidation(): void {
    this.rentalForm.get('start_date')?.valueChanges.subscribe(() => {
      this.validateDates();
      this.calculateTotalAmount();
    });

    this.rentalForm.get('end_date')?.valueChanges.subscribe(() => {
      this.validateDates();
      this.calculateTotalAmount();
    });
  }

  private validateDates(): void {
    const startDate = new Date(this.rentalForm.get('start_date')?.value);
    const endDate = new Date(this.rentalForm.get('end_date')?.value);

    if (startDate && endDate && startDate > endDate) {
      this.rentalForm.get('end_date')?.setErrors({ invalidDate: true });
    }
  }

  private calculateTotalAmount(): number {
    const startDateControl = this.rentalForm.get('start_date');
    const endDateControl = this.rentalForm.get('end_date');
    const carId = Number(this.rentalForm.get('car_fk')?.value);

    if (startDateControl?.value && endDateControl?.value && carId) {
      const startDate = new Date(startDateControl.value);
      const endDate = new Date(endDateControl.value);
      const selectedCar = this.cars.find(car => Number(car.car_id) === carId);

      if (selectedCar) {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const total = days * selectedCar.rental_price;

        this.rentalForm.get('rental_days')?.setValue(days);
        this.rentalForm.get('total_price')?.setValue(total);
        return total;
      }
    }

    this.rentalForm.get('rental_days')?.setValue(0);
    this.rentalForm.get('total_price')?.setValue(0);
    return 0;
  }

  private setupCarValidation(): void {
    this.rentalForm.get('car_fk')?.valueChanges.subscribe(value => {
      const startDateControl = this.rentalForm.get('start_date');
      const endDateControl = this.rentalForm.get('end_date');

      if (value) {
        startDateControl?.enable();
        endDateControl?.enable();
        this.calculateTotalAmount();
      } else {
        startDateControl?.disable();
        endDateControl?.disable();
        startDateControl?.setValue('');
        endDateControl?.setValue('');
        this.calculateTotalAmount();
      }
    });
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const formData = {
        ...this.rentalForm.getRawValue(),
        start_date: new Date(this.rentalForm.getRawValue().start_date).toISOString(),
        end_date: new Date(this.rentalForm.getRawValue().end_date).toISOString(),
        car_fk: Number(this.rentalForm.getRawValue().car_fk),
        customer_fk: Number(this.rentalForm.getRawValue().customer_fk),
        total_price: this.calculateTotalAmount(),
        status: this.rentalForm.getRawValue().status === 'true' || this.rentalForm.getRawValue().status === true
      };

      console.log('Dados do aluguel a ser enviado:', formData);
      if (this.isEditMode) {
        const rentalId = this.route.snapshot.params['id'];
        this.rentalService.updateRental(rentalId, formData).subscribe({
          next: () => {
            this.toastrService.success('Aluguel atualizado com sucesso');
            this.router.navigate(['/admin/alugueis']);
          },
          error: (error) => {
            this.toastrService.error('Erro ao atualizar o aluguel');
            console.error('Erro ao atualizar aluguel:', error);
          }
        });
      } else {
        console.log('Dados do aluguel a ser criado:', formData);
        this.rentalService.createRental(formData).subscribe({
          next: () => {
            this.toastrService.success('Aluguel criado com sucesso');
            this.router.navigate(['/admin/alugueis']);
          },
          error: (error) => {
            this.toastrService.error('Erro ao criar o aluguel');
            console.error('Erro ao criar aluguel:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/alugueis']);
  }

  get formattedTotalAmount(): string {
    const total = this.rentalForm.get('total_price')?.value || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(total);
  }

  get rentalDays(): number {
    return this.rentalForm.get('rental_days')?.value || 0;
  }
}
