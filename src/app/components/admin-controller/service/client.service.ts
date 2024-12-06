import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, CreateClient, UpdateClient } from '../types/client.types';
import { LoginService } from '../../auth-client/services/login.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient, private authService: LoginService) { }

  getClients(): Observable<Cliente[]> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.get<Cliente[]>('http://localhost:3001/customer', { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  getClientById(id: string): Observable<Cliente> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.get<Cliente>(`http://localhost:3001/customer/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }

  updateClient(id: string, client: UpdateClient): Observable<Cliente> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          return this.http.put<Cliente>(`http://localhost:3001/customer/${id}`, client, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    )
  }

  CreateClient(client: CreateClient): Observable<Cliente> {
    return this.http.post<Cliente>('http://localhost:3001/customer', client);
  }

  deleteClient(id: string): Observable<void> {
    return this.authService.verificarAuthAdmin().pipe(
      switchMap(isAdmin => {
        if (isAdmin) {
          const token = sessionStorage.getItem('auth-token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.delete<void>(`http://localhost:3001/customer/${id}`, { headers });
        }
        throw new Error('Usuário não tem permissão de administrador');
      })
    );
  }
}
