import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = sessionStorage.getItem('auth-token');

  if (!token) {
    toastr.error('Você precisa estar logado para acessar esta página');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
