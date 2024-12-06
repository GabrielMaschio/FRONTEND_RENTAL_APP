import { Routes } from '@angular/router';
import { RentalListComponent } from '../rental-list/rental-list.component';
import { RentalFormComponent } from '../rental-form/rental-form.component';

export const rentalRoutes: Routes = [
  {
    path: '',
    component: RentalListComponent
  },
  {
    path: 'novo',
    component: RentalFormComponent
  },
  {
    path: 'editar/:id',
    component: RentalFormComponent
  }
];
