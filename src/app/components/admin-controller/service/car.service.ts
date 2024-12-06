import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car, CreateCar, UpdateCar } from '../types/car.types';
import { LoginService } from '../../auth-client/services/login.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient, private authService: LoginService) { }

  getCars(): Observable<Car[]> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.get<Car[]>('http://localhost:3001/car', { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  getCarById(id: string): Observable<Car> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.get<Car>(`http://localhost:3001/car/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  createCar(car: CreateCar): Observable<Car> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.post<Car>('http://localhost:3001/car', car, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  updateCar(id: string, car: UpdateCar): Observable<Car> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.put<Car>(`http://localhost:3001/car/${id}`, car, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  deleteCar(id: string): Observable<void> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.delete<void>(`http://localhost:3001/car/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }
}
