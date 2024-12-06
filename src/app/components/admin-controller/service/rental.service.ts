import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Rental, CreateRental, UpdateRental } from '../types/rental.type';
import { LoginService } from '../../auth-client/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);

  constructor(private authService: LoginService) { }

  getRentals(): Observable<Rental[]> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.get<Rental[]>("http://localhost:3001/rental", { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  getRentalById(id: number): Observable<Rental> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.get<Rental>(`http://localhost:3001/rental/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  createRental(rental: CreateRental): Observable<Rental> {
    console.log('Dados do aluguel a ser criado:', rental);
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.post<Rental>("http://localhost:3001/rental", rental, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }
  updateRental(id: number, rental: UpdateRental): Observable<Rental> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.put<Rental>(`http://localhost:3001/rental/${id}`, rental, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  deleteRental(id: number): Observable<void> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.delete<void>(`http://localhost:3001/rental/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  // Métodos adicionais específicos para aluguéis

  // Buscar aluguéis ativos de um cliente
  getRentalsByCustomer(customerId: number): Observable<Rental[]> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.get<Rental[]>(`http://localhost:3001/rentals/customer/${customerId}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  // Buscar aluguéis de um carro específico
  getRentalsByCar(carId: number): Observable<Rental[]> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.get<Rental[]>(`http://localhost:3001/rentals/car/${carId}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  // Atualizar status do aluguel
  updateRentalStatus(id: number, status: string): Observable<Rental> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.patch<Rental>(`http://localhost:3001/rentals/${id}/status`, { status }, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  // Verificar disponibilidade do carro para um período
  checkCarAvailability(carId: number, startDate: string, endDate: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3001/rental/availability/car/${carId}`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
  }
}
