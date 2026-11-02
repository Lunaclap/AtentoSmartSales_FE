import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Objeto que se conecta con los inputs del formulario y el backend
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  // Variables para los botones visuales de perfil de tu HTML
  perfilSeleccionado: string = 'gerente';

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Método para alternar el perfil visualmente
  seleccionarPerfil(perfil: string): void {
    this.perfilSeleccionado = perfil;
  }

  // Método que se ejecuta al enviar el formulario
  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('¡Login exitoso! Token guardado:', response.token);
        // Redirigir al dashboard principal de tu Call Center
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        alert(this.errorMessage);
      }
    });
  }
}