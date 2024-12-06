import { SignupService } from '../services/signup.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

import { PrimaryInputComponent } from '../../../shared/primary-input/primary-input.component';
import { DefaultAuthLayoutComponent } from '../../default-auth-layout/default-auth-layout.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultAuthLayoutComponent,
    PrimaryInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  singupForm!: FormGroup;

  constructor(
    private router: Router,
    private SignupService: SignupService,
    private toastService: ToastrService
  ) {
    this.singupForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(6)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required, Validators.minLength(11)]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
    })
  }

  submit() {
    console.log(this.singupForm.value);
    this.SignupService.signup(
      this.singupForm.value.name,
      this.singupForm.value.email,
      this.singupForm.value.phone,
      this.singupForm.value.password
    ).pipe(take(1)).subscribe({
      next: () => {this.router.navigate(["home"])},
      error: (err) => {
        let errorMessage = "Erro inesperado! Tente novamente mais tarde.";

        if (err.status === 401) {
          errorMessage = "Credenciais inválidas! Verifique os dados.";
        } else if (err.status === 400) {
          errorMessage = "Solicitação inválida. Verifique os dados e tente novamente.";
        } else if (err.status === 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde.";
        }
        console.error(err);
        this.toastService.error(errorMessage);
      },
    })
  }

  navigate() {
    this.router.navigate(["home"]);
  }
}
