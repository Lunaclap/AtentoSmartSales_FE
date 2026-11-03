import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Ajusta la ruta relativa según dónde esté tu sidebar
import { IconComponent } from '../icon/icon';

const ROLES: Record<string, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_MANAGER: 'Gerente comercial',
  ROLE_ASESOR: 'Asesor comercial'
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  usuario = localStorage.getItem('username') || 'Usuario';
  rol = localStorage.getItem('userRole') || '';
  rolTexto = ROLES[this.rol] || 'Usuario';
  iniciales = this.usuario.slice(0, 2).toUpperCase();

  menu = [
    { ruta: '/dashboard', texto: 'Dashboard comercial', icono: 'dash' },
    { ruta: '/equipos-asesores', texto: 'Equipos y asesores', icono: 'team' },
    { ruta: '/reportes', texto: 'Reportes', icono: 'report' },
    { ruta: '/clientes', texto: 'Clientes', icono: 'user' },
    { ruta: '/ventas', texto: 'Ventas', icono: 'cart' },
    { ruta: '/metas-kpi', texto: 'Metas y KPI', icono: 'target' },
    // El módulo de usuarios solo lo ve el administrador (la ruta también está protegida por adminGuard)
    ...(this.rol === 'ROLE_ADMIN' ? [{ ruta: '/usuarios', texto: 'Gestión de usuarios', icono: 'key' }] : [])
  ];

  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    // 1. Borra el token y los datos del almacenamiento local
    this.authService.logout();

    // 2. Redirige al usuario al login
    this.router.navigate(['/']);
  }
}
