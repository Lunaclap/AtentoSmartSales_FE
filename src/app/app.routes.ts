import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard'; // <--- Importar guard de admin
import { UsuariosComponent } from './features/usuarios/usuarios';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'equipos-asesores', loadComponent: () => import('./features/dashboard/equipos-asesores/equipos-asesores').then(m => m.EquiposAsesoresComponent) },
      { path: 'reportes', loadComponent: () => import('./features/dashboard/reportes/reportes').then(m => m.ReportesComponent) },
      { path: 'clientes', loadComponent: () => import('./features/dashboard/clientes/clientes').then(m => m.ClientesComponent) },
      { path: 'ventas', loadComponent: () => import('./features/dashboard/ventas/ventas').then(m => m.VentasComponent) },
      { path: 'metas-kpi', loadComponent: () => import('./features/dashboard/metas-kpi/metas-kpi').then(m => m.MetasKpiComponent) },
      
      // Módulo de usuarios protegido estrictamente para el Administrador
      { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];