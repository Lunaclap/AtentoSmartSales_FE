import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { EquiposAsesoresComponent } from './features/dashboard/equipos-asesores/equipos-asesores';
import { ReportesComponent } from './features/dashboard/reportes/reportes';
import { ClientesComponent } from './features/dashboard/clientes/clientes';
import { MetasKpiComponent } from './features/dashboard/metas-kpi/metas-kpi';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'equipos-asesores', component: EquiposAsesoresComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'metas-kpi', component: MetasKpiComponent },
  { path: '**', redirectTo: '' }
];