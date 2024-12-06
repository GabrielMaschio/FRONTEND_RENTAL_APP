import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../components/auth-client/services/login.service';
import { map, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authVerifGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return loginService.verificarAutenticacao().pipe(
    map((isAuthenticated: boolean) => {
      return isAuthenticated;      // Se chegou aqui, o token é válido
    }),
    catchError((error) => {
      if (error.message) {
        toastr.error(error.message);
      } else {
        toastr.error('Sua sessão expirou! Por favor, faça login novamente.');
      }
      router.navigate(['/login']);
      return of(false);
    })
  );
};
