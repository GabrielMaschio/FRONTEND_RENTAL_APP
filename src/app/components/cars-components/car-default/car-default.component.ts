import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CarCardComponent } from '../car-card/car-card.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../service/car.service';
import { carsResponse } from '../types/cars-response.type';

@Component({
  selector: 'app-car-default',
  standalone: true,
  imports: [
    CarCardComponent,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './car-default.component.html',
  styleUrl: './car-default.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CarDefaultComponent implements OnInit {
  cars: carsResponse[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars(): void {
    this.carService.getAvailableCars().subscribe({
      next: (res: carsResponse[]) => {
        this.cars = res;
      },
      error: (error) => {
        console.error('Erro ao buscar carros:', error);
      }
    });
  }
}
