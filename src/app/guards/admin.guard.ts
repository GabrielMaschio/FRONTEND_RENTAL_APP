import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../components/auth-client/services/login.service';
import { map, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return loginService.verificarAuthAdmin().pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true;      // Se chegou aqui e é admin, permite o acesso
      }
      toastr.error('Acesso não autorizado. Área restrita para administradores.');
      router.navigate(['/home']);
      return false;
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
