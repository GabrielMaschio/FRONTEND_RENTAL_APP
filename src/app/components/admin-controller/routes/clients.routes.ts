import { Routes } from '@angular/router';
import { ClientListComponent } from '../client-list/client-list.component';
import { ClientFormComponent } from '../client-form/client-form.component';

export const clientsRoutes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'novo',
    component: ClientFormComponent
  },
  {
    path: 'editar/:id',
    component: ClientFormComponent
  }
];
