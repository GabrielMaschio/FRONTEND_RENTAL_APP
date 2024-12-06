import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RentalService } from '../service/rental.service';
import { Rental } from '../types/rental.type';
import Swal from 'sweetalert2';
import { RentalPipePipe } from './rental-pipe.pipe';

@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RentalPipePipe],
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
  alugueis: Rental[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  private rentalService = inject(RentalService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rentalService.getRentals().subscribe({
      next: (rentals) => {
        this.alugueis = rentals;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocorreu um erro ao carregar os aluguéis';
        this.alugueis = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onEdit(rental: Rental): void {
    this.router.navigate([`/admin/alugueis/editar/${rental.rental_id}`]);
  }

  onDelete(rental: Rental): void {
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
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.rentalService.deleteRental(rental.rental_id).subscribe({
          next: () => {
            swalWithBootstrapButtons.fire({
              title: 'Deletado!',
              text: 'O aluguel foi removido com sucesso.',
              icon: 'success'
            });
            this.loadRentals();
          },
          error: (error) => {
            Swal.fire({
              title: 'Erro!',
              text: 'Ocorreu um erro ao deletar o aluguel.',
              icon: 'error'
            });
            console.error('Erro ao deletar aluguel:', error);
          }
        });
      }
    });
  }
}
