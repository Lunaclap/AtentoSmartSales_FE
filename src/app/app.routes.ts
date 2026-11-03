import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { asesorGuard, gerenteGuard, inicioPorRol } from './core/guards/rol.guard';
import { UsuariosComponent } from './features/usuarios/usuarios';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Gerente y administrador
      { path: 'dashboard', canActivate: [gerenteGuard], loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'reportes', canActivate: [gerenteGuard], loadComponent: () => import('./features/dashboard/reportes/reportes').then(m => m.ReportesComponent) },
      { path: 'reportes/asesor/:id', canActivate: [gerenteGuard], loadComponent: () => import('./features/dashboard/reportes/detalle-asesor').then(m => m.ReporteAsesorComponent) },
      { path: 'campanas', canActivate: [gerenteGuard], loadComponent: () => import('./features/dashboard/campanas/campanas').then(m => m.CampanasComponent) },
      { path: 'metas-kpi', canActivate: [gerenteGuard], loadComponent: () => import('./features/dashboard/metas-kpi/metas-kpi').then(m => m.MetasKpiComponent) },

      // Asesor
      { path: 'mi-reporte', canActivate: [asesorGuard], loadComponent: () => import('./features/dashboard/reportes/detalle-asesor').then(m => m.MiReporteComponent) },

      // Ambos roles: el backend filtra lo que ve cada uno
      { path: 'clientes', loadComponent: () => import('./features/dashboard/clientes/clientes').then(m => m.ClientesComponent) },
      { path: 'ventas', loadComponent: () => import('./features/dashboard/ventas/ventas').then(m => m.VentasComponent) },

      // Módulo de usuarios protegido estrictamente para el Administrador
      { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },

      { path: 'inicio', redirectTo: inicioPorRol, pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
