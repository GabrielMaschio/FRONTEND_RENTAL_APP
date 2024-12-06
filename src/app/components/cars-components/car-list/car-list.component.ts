import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CarService } from '../service/car.service';
import { CarListResponse } from '../types/cars-response.type';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  protected cars: CarListResponse[] = [];
  protected errorMessage: string = '';
  protected isLoading: boolean = false;

  private carService = inject(CarService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadCars();
  }

  private loadCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carService.getCarsByClientId().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocorreu um erro ao carregar os veículos do cliente';
        this.cars = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
