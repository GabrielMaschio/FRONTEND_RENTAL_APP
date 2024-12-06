import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, CommonModule } from '@angular/common';
import { carsResponse } from '../types/cars-response.type';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss'
})
export class CarCardComponent {
  @Input() car!: carsResponse;

  constructor(private router: Router) {}

  navigate(id: number) {
    console.log('Navegando para:', id);
    this.router.navigate(['/cars/alugar', id]);
  }
}
