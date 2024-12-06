import { Component, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

// Registra o locale pt-BR
registerLocaleData(localePt);

@Component({
  selector: 'app-default-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './default-admin-layout.component.html',
  styleUrls: ['./default-admin-layout.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class DefaultAdminLayoutComponent {
  private router = inject(Router);

  pageTitle = '';
  currentDateTime = new Date();

  constructor() {
    // Atualiza o título baseado na rota atual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const path = this.router.url;
        if (path.includes('/clientes')) return 'Painel Administrativo | Clientes';
        if (path.includes('/carros')) return 'Painel Administrativo | Carros';
        if (path.includes('/alugueis')) return 'Painel Administrativo | Aluguéis';
        return 'Painel Administrativo';
      })
    ).subscribe(title => this.pageTitle = title);

    // Atualiza o horário a cada minuto
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 60000);
  }
}
