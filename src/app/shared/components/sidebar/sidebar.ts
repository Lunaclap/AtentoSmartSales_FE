import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ComercialService, esGerente } from '../../../core/services/comercial.service';
import { IconComponent } from '../icon/icon';

const ROLES: Record<string, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_MANAGER: 'Gerente comercial',
  ROLE_ASESOR: 'Asesor comercial'
};

interface Opcion { ruta: string; texto: string; icono: string }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private api = inject(ComercialService);
  private router = inject(Router);

  usuario = localStorage.getItem('username') || 'Usuario';
  rol = localStorage.getItem('userRole') || '';
  rolTexto = ROLES[this.rol] || 'Usuario';
  iniciales = this.usuario.slice(0, 2).toUpperCase();

  // Cada rol ve sus vistas (REQ-30); las rutas también están protegidas por guards y el backend valida cada llamada.
  menu: Opcion[] = esGerente()
    ? [
        { ruta: '/dashboard', texto: 'Dashboard comercial', icono: 'dash' },
        { ruta: '/clientes', texto: 'Clientes', icono: 'user' },
        { ruta: '/ventas', texto: 'Ventas', icono: 'cart' },
        { ruta: '/reportes', texto: 'Reportes por asesor', icono: 'team' },
        { ruta: '/campanas', texto: 'KPIs por campaña', icono: 'report' },
        { ruta: '/metas-kpi', texto: 'Metas', icono: 'target' },
        ...(this.rol === 'ROLE_ADMIN' ? [{ ruta: '/usuarios', texto: 'Gestión de usuarios', icono: 'key' }] : [])
      ]
    : [
        { ruta: '/mi-reporte', texto: 'Mi reporte', icono: 'dash' },
        { ruta: '/clientes', texto: 'Mis clientes', icono: 'user' },
        { ruta: '/ventas', texto: 'Mis ventas', icono: 'cart' }
      ];

  onLogout(): void {
    this.authService.logout();
    this.api.limpiar();
    this.router.navigate(['/']);
  }
}
