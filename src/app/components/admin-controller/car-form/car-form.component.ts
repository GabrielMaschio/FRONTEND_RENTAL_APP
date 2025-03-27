import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CarService } from '../service/car.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService, Category } from '../service/category.service';
import { UpdateCar } from '../types/car.types';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);
  private toastrService = inject(ToastrService);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];

  carForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    license_plate: ['', [Validators.required]],
    year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    rental_price: [null, [Validators.required, Validators.min(0)]],
    category_fk: [null, [Validators.required]]
  });

  isEditMode = false;

  ngOnInit(): void {
    this.loadCategories();
    const carId = this.route.snapshot.params['id'];
    if (carId) {
      this.isEditMode = true;
      this.carService.getCarById(carId).subscribe(car => {
        this.carForm.patchValue(car);
        this.carForm.get('category_fk')?.setValue(car.category.category_id);
      });
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.toastrService.error('Erro ao carregar categorias');
      }
    });
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const formData = {
        ...this.carForm.value,
        rental_price: Number(this.carForm.value.rental_price),
        category_fk: Number(this.carForm.value.category_fk)
      };

      if (this.isEditMode) {
        this.carService.updateCar(this.route.snapshot.params['id'], formData).subscribe({
          next: () => {
            this.toastrService.success('Carro atualizado com sucesso!');
            this.router.navigate(['/admin/carros']);
          },
          error: (error) => {
            console.error('Erro ao atualizar:', error);
            this.toastrService.error('Erro ao atualizar carro! Por favor, tente novamente.' + error.error.message);
          }
        });
      } else {
        console.log('Dados enviados:', formData);
        this.carService.createCar(formData).subscribe({
          next: () => {
            this.toastrService.success('Carro criado com sucesso!');
            this.router.navigate(['/admin/carros']);
          },
          error: (error) => {
            console.error('Erro ao criar:', error);
            this.toastrService.error('Erro ao criar carro! Por favor, tente novamente.' + error.error.message);
          }
        });
      }
    } else {
      this.toastrService.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/carros']);
  }
}
