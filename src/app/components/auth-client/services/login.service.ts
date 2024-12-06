import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, switchMap, of, map, catchError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  role: string | null;
}

interface LoginResponse {
  token: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = 'http://localhost:3001';
  private http = inject(HttpClient);

  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: false,
    username: null,
    role: null
  });

  login(email: string, password: string): Observable<UserData> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        switchMap(response => {
          sessionStorage.setItem('auth-token', response.token);
          return this.validateToken();
        }),
        tap(userData => {
          this.authState.next({
            isLoggedIn: true,
            username: userData.name,
            role: userData.role
          });
        })
      );
  }

  private validateToken(): Observable<UserData> {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserData>(`${this.apiUrl}/validate-token`, { headers });
  }

  verificarLogin(): Observable<{ isLoggedIn: boolean; username: string }> {
    return this.validateToken().pipe(
      tap(userData => {
        this.authState.next({
          isLoggedIn: true,
          username: userData.name,
          role: userData.role
        });
      }),
      map(userData => ({
        isLoggedIn: true,
        username: userData.name
      })),
      catchError(() => {
        this.authState.next({
          isLoggedIn: false,
          username: null,
          role: null
        });
        return of({ isLoggedIn: false, username: '' });
      })
    );
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');

    this.authState.next({
      isLoggedIn: false,
      username: null,
      role: null
    });
  }

  verificarAutenticacao(): Observable<boolean> {
    const token = sessionStorage.getItem('auth-token');

    if (!token) {
      return of(false);
    }

    return this.validateToken().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  verificarAuthAdmin(): Observable<boolean> {
    const token = sessionStorage.getItem('auth-token');

    if (!token) {
      return of(false);
    }

    return this.validateToken().pipe(
      map(userData => userData.role === 'admin'),
      catchError(() => of(false))
    );
  }


}
