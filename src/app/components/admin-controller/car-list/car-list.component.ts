import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../service/car.service';
import { Car } from '../types/car.types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  protected carros: Car[] = [];
  protected errorMessage: string = '';
  protected isLoading: boolean = false;

  private carService = inject(CarService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCars();
  }

  private loadCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carService.getCars().subscribe({
      next: (cars) => {
        this.carros = cars;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocorreu um erro ao carregar os carros';
        this.carros = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onEdit(car: Car): void {
    this.router.navigate([`/admin/carros/editar/${car.car_id}`]);
  }

  onDelete(car: Car): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não poderá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, exclua!',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.carService.deleteCar(car.car_id).subscribe({
          next: () => {
            this.carros = this.carros.filter(c => c.car_id !== car.car_id);
            Swal.fire('Excluído!', 'O carro foi excluído com sucesso.', 'success');
          },
          error: (error) => {
            this.errorMessage = error.message || 'Ocorreu um erro ao excluir o carro';
            Swal.fire('Erro', this.errorMessage, 'error');
          }
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelado', 'O carro não foi excluído.', 'error');
      }
    });
  }
}
