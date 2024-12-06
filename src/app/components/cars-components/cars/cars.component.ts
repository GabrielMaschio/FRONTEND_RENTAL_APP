import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { carsResponse } from '../types/cars-response.type';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../auth-client/services/login.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit, OnDestroy {
  cars: carsResponse[] = [];
  private loginService = inject(LoginService);
  private subscription?: Subscription;
  isLoggedIn: boolean = false;
  username: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.loginService.getAuthState().subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
      this.username = state.username;
    });

    this.loginService.verificarLogin().subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
