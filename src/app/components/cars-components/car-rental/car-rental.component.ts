import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, model, OnInit, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CarService } from '../service/car.service';
import { carModal, carsResponse } from '../types/cars-response.type';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RentalRequest } from '../types/rental.type';
import { LoginService } from '../../auth-client/services/login.service';
import { CarModalComponent } from '../car-modal/car-modal.component';


@Component({
  selector: 'app-car-rental',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    CarModalComponent
  ],
  providers: [],
  templateUrl: './car-rental.component.html',
  styleUrl: './car-rental.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <app-car-modal
        *ngIf="isModalOpen"
        [carData]="carModalData"
        (closeModal)="closeModal()">
      </app-car-modal>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})

export class CarRentalComponent implements OnInit, OnDestroy {
  rentalForm!: FormGroup;

  id: string | undefined;
  car!: carsResponse;
  selected = model<Date | null>(null);

  options: string[] = [];
  cars: carsResponse[] = [];

  @Output() selectedValue = new EventEmitter<string>(); // Para emitir o valor selecionado

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(); // A data mínima será a data atual
  readonly maxDate = new Date(this._currentYear + 1, 11, 31); // 31 de dezembro do ano atual

  totalPrice = 0; // Adicione esta propriedade

  private loginService = inject(LoginService);
  private subscription?: Subscription;
  isLoggedIn: boolean = false;
  username: string | null = null;

  minEndDate = new Date(this.minDate.getTime() + 24 * 60 * 60 * 1000); // Dia seguinte ao atual

  isModalOpen = false;
  carModalData!: carModal;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private cd: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.generateHours();

    this.rentalForm = new FormGroup({
      rental_days: new FormControl("", [Validators.required, Validators.min(1), Validators.max(30)]),
      start_date: new FormControl(new Date(), [Validators.required]),
      end_date: new FormControl(new Date(), [Validators.required]),
      start_hour: new FormControl("7 AM", [Validators.required]),
      end_hour: new FormControl("6 PM", [Validators.required]),
      cars: new FormControl(this.route.snapshot.paramMap.get('id'), [Validators.required]),
    })
  }


  generateHours() {
    const startHour = 7; // Início às 9 AM
    const endHour = 19; // Fim às 5 PM (18h)

    for (let hour = startHour; hour < endHour; hour++) {
      const amPm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Converte 12h formato
      const optionLabel = `${formattedHour} ${amPm}`;
      this.options.push(optionLabel); // Adiciona a opção ao array
    }
  }

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedValue.emit(value); // Emite o valor selecionado
  }

  onCarChange(value: string) {
    const car_id = this.rentalForm.get(value)?.value;
    this.loadCar(car_id);
    this.calculateRentalDays();
  }

  ngOnInit(): void {
    this.subscription = this.loginService.getAuthState().subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
      this.username = state.username;
    });

    this.loginService.verificarLogin().subscribe();

    const idParam = this.route.snapshot.paramMap.get('id');

    this.id = idParam !== null ? idParam : undefined;

    this.fetchCars();
    this.loadCar(this.id);
    this.rentalForm.controls['start_date'].disable();
    this.rentalForm.controls['end_date'].disable();

    this.rentalForm.get('cars')?.valueChanges.subscribe(value => {
      this.loadCar(value);
    });

    this.rentalForm.get('start_date')?.valueChanges.subscribe(() => {
      this.calculateRentalDays();
    });

    this.rentalForm.get('end_date')?.valueChanges.subscribe(() => {
      this.calculateRentalDays();
    });

    this.rentalForm.controls['rental_days'].disable();

    this.rentalForm.get('start_date')?.valueChanges.subscribe(date => {
      if (date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        this.minEndDate = nextDay;

        const currentEndDate = this.rentalForm.get('end_date')?.value;
        if (currentEndDate && new Date(currentEndDate) < this.minEndDate) {
          this.rentalForm.patchValue({
            end_date: this.minEndDate
          });
        }

        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadCar(id: string | undefined) {
    if (id) {
      this.carService.getCarById(id).subscribe({
        next: (response) => {
          this.car = response;
          this.cd.markForCheck();
          const currentDays = this.rentalForm.get('rental_days')?.value;
          this.calculateTotalPrice(currentDays);
        },
        error: (err) => {
          console.error('Erro ao carregar o carro:', err);
        }
      });
    }
  }

  fetchCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (res: carsResponse[]) => {
        this.cars = res;
        console.log(this.cars);
      },
      error: (error) => {
        console.error('Erro ao buscar carros:', error);
      }
    });
  }

  calculateTotalPrice(days: number): void {
    if (this.car && days > 0) {
      this.totalPrice = this.car.rental_price * days;
      this.cd.markForCheck();
    } else {
      this.totalPrice = 0;
    }
  }

  onSubmitRental() {
    if (this.rentalForm.valid && this.car) {
      const token = sessionStorage.getItem('auth-token');
      if (!token) {
        this.toastrService.error('Usuário não autenticado. Por favor, faça login.');
        this.router.navigate(['/login']);
        return;
      }

      this.carService.validateToken().pipe(
        take(1),
        catchError(error => {
          console.error('Erro na validação do token:', error);
          if (error.status === 401) {
            this.toastrService.error('Sessão expirada. Por favor, faça login novamente.');
            this.router.navigate(['/login']);
          }
          throw error;
        })
      ).subscribe({
        next: (userData) => {
          const startDate = new Date(this.rentalForm.get('start_date')?.value);
          const endDate = new Date(this.rentalForm.get('end_date')?.value);

          const rentalData: RentalRequest = {
            car_fk: Number(this.car.car_id),
            customer_fk: userData.id,
            rental_days: Number(this.rentalForm.get('rental_days')?.value),
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            total_price: Number(this.totalPrice),
            status: true
          };

          this.carService.createRental(rentalData).pipe(take(1)).subscribe({
            next: () => {
              this.carModalData = {
                model: this.car.name,
                category: this.car.category.name,
                price: this.totalPrice,
                imageUrl: "/assets/images/car_category" + this.car.category.category_id + ".png",
                startDate: startDate.toLocaleDateString('pt-BR'),
                endDate: endDate.toLocaleDateString('pt-BR')
              };

              this.isModalOpen = true;
              this.cd.markForCheck();
            },
            error: (err) => {
              console.error('Erro ao criar aluguel:', err);
              this.toastrService.error('Erro ao alugar o carro. Tente novamente.');
            }
          });
        },
        error: (err) => {
          console.error('Erro na validação do token:', err);
          this.toastrService.error('Sessão expirada. Por favor, faça login novamente.');
          this.router.navigate(['/login']);
        }
      });
    }
  }

  closeModal(route: string): void {
    this.isModalOpen = false;
    this.cd.markForCheck();
    this.router.navigate([route]);
  }

  private calculateRentalDays(): void {
    const startDate = this.rentalForm.get('start_date')?.value;
    const endDate = this.rentalForm.get('end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      this.rentalForm.patchValue({
        rental_days: diffDays
      }, { emitEvent: false });

      this.calculateTotalPrice(diffDays);
    }
  }
}

export class ParentComponent {
  isModalOpen = false;
  carData!: carModal;

  closeModal(): void {
    this.isModalOpen = false;
  }

  openModal(): void {
    this.isModalOpen = true;
  }
}
