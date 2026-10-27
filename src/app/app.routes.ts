import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { EquiposAsesoresComponent } from './features/dashboard/equipos-asesores/equipos-asesores';
import { ReportesComponent } from './features/dashboard/reportes/reportes';
import { ClientesComponent } from './features/dashboard/clientes/clientes';
import { MetasKpiComponent } from './features/dashboard/metas-kpi/metas-kpi';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  
  // Layout principal que contiene el Sidebar y el área dinámica
{
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent) },
    { path: 'equipos-asesores', loadComponent: () => import('./features/dashboard/equipos-asesores/equipos-asesores').then(m => m.EquiposAsesoresComponent) },
    { path: 'reportes', loadComponent: () => import('./features/dashboard/reportes/reportes').then(m => m.ReportesComponent) },
    { path: 'clientes', loadComponent: () => import('./features/dashboard/clientes/clientes').then(m => m.ClientesComponent) },
    { path: 'ventas', loadComponent: () => import('./features/dashboard/ventas/ventas').then(m => m.VentasComponent) }, // <--- NUEVO
    { path: 'metas-kpi', loadComponent: () => import('./features/dashboard/metas-kpi/metas-kpi').then(m => m.MetasKpiComponent) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},

  { path: '**', redirectTo: '' }
];