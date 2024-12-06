import { Routes } from '@angular/router';
import { CarsComponent } from '../cars/cars.component';
import { CarRentalComponent } from '../car-rental/car-rental.component';
import { authGuard } from '../../../guards/auth.guard';
import { authVerifGuard } from '../../../guards/authVerif.guard';
import { CarDefaultComponent } from '../car-default/car-default.component';
import { CarListComponent } from '../car-list/car-list.component';


export const carsRoutes: Routes = [
  {
    path: '',
    component: CarsComponent,
    children: [
      {
        path: '',
        component: CarDefaultComponent
      },
      {
        path: 'alugar/:id',
        component: CarRentalComponent,
        canActivate: [authGuard, authVerifGuard]
      },
      {
        path: 'list',
        component: CarListComponent,
        canActivate: [authGuard, authVerifGuard]
      }
    ]
  }
];
