import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ConfiguracionComponent } from './components/configuracion/configuracion';
import { AgendaComponent } from './components/agenda/agenda';
import { ServiciosComponent } from './components/servicios/servicios';
import { ClientesComponent } from './components/clientes/clientes';
import { GananciasComponent } from './components/ganancias/ganancias';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'ganancias', component: GananciasComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: '**', redirectTo: '' }
];
