import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ConfiguracionComponent } from './components/configuracion/configuracion';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: '**', redirectTo: '' }
];
