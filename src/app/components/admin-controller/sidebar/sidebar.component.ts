import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from './../../../../../src/app/components/auth-client/services/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  async onLogout(): Promise<void> {
    try {
      this.loginService.logout();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }
}
