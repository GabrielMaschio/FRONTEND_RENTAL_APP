import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../auth-client/services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  @Input() isLoggedIn: boolean = false;
  @Input() username: string | null = null;

  async logout(): Promise<void> {
    try {
      await this.loginService.logout();
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }
}
