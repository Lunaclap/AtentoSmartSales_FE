import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Ajusta la ruta relativa según dónde esté tu sidebar

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    // 1. Borra el token y los datos del almacenamiento local
    this.authService.logout();
    
    // 2. Redirige al usuario al login
    this.router.navigate(['/']); 
  }
}