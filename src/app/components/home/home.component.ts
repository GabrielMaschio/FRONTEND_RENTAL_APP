import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { LoginService } from '../auth-client/services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private loginService = inject(LoginService);
  private subscription?: Subscription;

  isLoggedIn: boolean = false;
  username: string | null = null;

  ngOnInit() {
    // Inscreve nas mudanças do estado de autenticação
    this.subscription = this.loginService.getAuthState().subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
      this.username = state.username;
    });

    // Verifica o login inicial
    this.loginService.verificarLogin().subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
