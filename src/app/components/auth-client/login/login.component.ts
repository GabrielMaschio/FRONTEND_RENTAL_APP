import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

import { PrimaryInputComponent } from '../../../shared/primary-input/primary-input.component';
import { RowComponent } from '../../../shared/row/row.component';
import { DefaultAuthLayoutComponent } from '../../default-auth-layout/default-auth-layout.component';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultAuthLayoutComponent,
    PrimaryInputComponent,
    ReactiveFormsModule,
    RowComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
    })
  }

  submit() {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(take(1))
      .subscribe({
        next: (userData) => {
          if (userData.role === 'customer') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          let errorMessage = "Erro inesperado! Tente novamente mais tarde.";

          if (err.status === 401) {
            errorMessage = "Credenciais inválidas! Verifique seu e-mail e senha.";
          } else if (err.status === 400) {
            errorMessage = "Solicitação inválida. Verifique os dados e tente novamente.";
          } else if (err.status === 500) {
            errorMessage = "Erro no servidor. Tente novamente mais tarde.";
          }
          console.error(err);
          this.toastService.error(errorMessage);
        },
      });
  }

  navigate() {
    this.router.navigate(["home"]);
  }
}
