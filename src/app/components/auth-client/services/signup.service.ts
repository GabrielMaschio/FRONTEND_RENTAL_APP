import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

import { SignupResponse } from '../types/signup-response.type';
import { LoginService } from './login.service';
import { UserData } from '../types/user-data.type';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private readonly apiUrl = 'http://localhost:3001';
  private readonly httpClient = inject(HttpClient);
  private readonly loginService = inject(LoginService);

  signup(name: string, email: string, phone: string, password: string): Observable<UserData> {
    const payload = { name, email, phone, password };

    return this.httpClient.post<SignupResponse>(`${this.apiUrl}/customer`, payload)
      .pipe(
        switchMap((response) => this.loginService.login(response.email, password)),
        catchError((error) => {
          console.error('[SignupService] Erro no processo de cadastro:', error);
          return throwError(() => new Error(
            error.error?.message || 'Falha no processo de cadastro. Por favor, tente novamente.'
          ));
        })
      );
  }
}
