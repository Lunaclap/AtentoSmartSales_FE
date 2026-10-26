import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-demo';
  backendStatus = 'Conectando con el backend...';

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.getTestMessage().subscribe({
      next: () => {
        this.backendStatus = '¡Conexión exitosa con Spring Boot!';
      },
      error: (err) => {
        console.error('Error al conectar:', err);
        this.backendStatus = 'Error de conexión (revisa CORS o si el backend está encendido)';
      }
    });
  }
}