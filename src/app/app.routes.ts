import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth-client/login/login.component';
import { SignupComponent } from './components/auth-client/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { authVerifGuard } from './guards/authVerif.guard';
import { adminGuard } from './guards/admin.guard';
import { DefaultAdminLayoutComponent } from './components/admin-controller/default-admin-layout/default-admin-layout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'cars',
    loadChildren: () => import('./components/cars-components/routes/cars.routes')
      .then(m => m.carsRoutes)
  },
  {
    path: 'admin',
    component: DefaultAdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'clientes',
        loadChildren: () => import('./components/admin-controller/routes/clients.routes')
          .then(m => m.clientsRoutes)
      },
      {
        path: 'carros',
        loadChildren: () => import('./components/admin-controller/routes/cars.routes')
          .then(m => m.carsRoutes)
      },
      {
        path: 'alugueis',
        loadChildren: () => import('./components/admin-controller/routes/rental.routes')
          .then(m => m.rentalRoutes)
      }
    ]
  }
];
