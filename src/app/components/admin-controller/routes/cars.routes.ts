import { Routes } from '@angular/router';
import { CarListComponent } from '../car-list/car-list.component';
import { CarFormComponent } from '../car-form/car-form.component';

export const carsRoutes: Routes = [
  {
    path: '',
    component: CarListComponent
  },
  {
    path: 'novo',
    component: CarFormComponent
  },
  {
    path: 'editar/:id',
    component: CarFormComponent
  }
]; 
