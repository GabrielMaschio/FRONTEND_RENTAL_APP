import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { carModal } from '../types/cars-response.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-modal.component.html',
  styleUrl: './car-modal.component.scss'
})
export class CarModalComponent {
  @Input() carData!: any;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClose(route: string): void {
    this.closeModal.emit();
    this.router.navigate([route]);
  }

  // Fecha o modal se clicar fora dele
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal.emit();
    }
  }
}
