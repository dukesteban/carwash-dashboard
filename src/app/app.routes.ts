import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ConfiguracionComponent } from './components/configuracion/configuracion';
import { AgendaComponent } from './components/agenda/agenda';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: '**', redirectTo: '' }
];
