import { CarListResponse, carsResponse } from './../types/cars-response.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RentalRequest } from '../types/rental.type';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { LoginService } from '../../auth-client/services/login.service';
import { UserData } from '../../auth-client/types/user-data.type';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  constructor(private httpCliente: HttpClient, private authService: LoginService) { }

  validateToken(): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const cleanToken = token.trim();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${cleanToken}`)
      .set('Accept', 'application/json');

    return this.httpCliente.get('http://localhost:3001/validate-token', { headers })
      .pipe(
        map(userData => userData),
        catchError(() => {
          return of(false);
        })
      );
  }

  getCars() {
    return this.httpCliente.get<carsResponse>("http://localhost:3001/car");
  }

  getCarById(id: string) {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpCliente.get<carsResponse>(`http://localhost:3001/car/${id}`, { headers });
  }

  createRental(rentalData: RentalRequest): Observable<any> {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.httpCliente.post('http://localhost:3001/rental', rentalData, { headers });
  }

  getAvailableCars(): Observable<carsResponse[]> {
    return this.httpCliente.get<carsResponse[]>('http://localhost:3001/available');
  }

  getCarsByClientId(): Observable<CarListResponse[]> {
    return this.validateToken().pipe(
      switchMap((userData: UserData) => {
        const token = sessionStorage.getItem('auth-token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        console.log(userData);

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.httpCliente.get<CarListResponse[]>(
          `http://localhost:3001/rental/client/${userData.id}`,
          { headers }
        );
      }),
      catchError((error) => {
        console.error('Erro ao buscar carros do cliente:', error);
        throw new Error('Erro ao buscar carros do cliente');
      })
    );
  }
}
