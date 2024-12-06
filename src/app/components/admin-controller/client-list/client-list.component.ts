import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientService } from '../service/client.service';
import { Cliente } from '../types/client.types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clientes: Cliente[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  private clientService = inject(ClientService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClients().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocorreu um erro ao carregar os clientes';
        this.clientes = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate([`/admin/clientes/editar/${cliente.customer_id}`]);
  }

  onDelete(cliente: Cliente): void {
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
        this.clientService.deleteClient(cliente.customer_id).subscribe({
          next: () => {
            swalWithBootstrapButtons.fire({
              title: 'Deletado!',
              text: 'O cliente foi removido com sucesso.',
              icon: 'success'
            });
            this.loadClients();
          },
          error: (error) => {
            Swal.fire({
              title: 'Erro!',
              text: 'Ocorreu um erro ao deletar o cliente.',
              icon: 'error'
            });
            console.error('Erro ao deletar cliente:', error);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'O cliente não foi removido!',
          icon: 'error'
        });
      }
    });
  }
}
