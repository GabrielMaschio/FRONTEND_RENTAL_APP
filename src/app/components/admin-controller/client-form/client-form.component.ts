import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../service/client.service';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  providers: [
    provideNgxMask()
  ]
})
export class ClientFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private toastrService = inject(ToastrService);

  clientForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
    password: ['', []]
  });

  isEditMode = false;

  ngOnInit(): void {
    const clientId = this.route.snapshot.params['id'];
    if (clientId) {
      this.isEditMode = true;
      this.clientForm.get('password')?.clearValidators();

      this.clientService.getClientById(clientId).subscribe(client => {
        this.clientForm.patchValue(client);
      });
    } else {
      this.clientForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }

    this.clientForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      if (this.isEditMode) {
        this.clientService.updateClient(this.route.snapshot.params['id'], this.clientForm.value).subscribe({
          next: () => {
            this.toastrService.success('Cliente atualizado com sucesso!');
            this.router.navigate(['/admin/clientes']);
          },
          error: (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.toastrService.error('Erro ao atualizar cliente! Por favor, tente novamente.');
          }
        });
      } else {
        this.clientService.CreateClient(this.clientForm.value).subscribe({
          next: () => {
            this.toastrService.success('Cliente criado com sucesso!');
            this.router.navigate(['/admin/clientes']);
          }
        });
      }
    } else {
      this.toastrService.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/clientes']);
  }
}
