import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { IconComponent } from '../../../shared/components/icon/icon';
import { inicioPorRol } from '../../../core/guards/rol.guard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
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

  // Mini gráfico decorativo del panel izquierdo
  barras = [30, 42, 36, 52, 46, 60, 54];

  errorMessage = signal('');
  errorUsuario = signal('');
  errorPassword = signal('');
  cargando = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  // Método para alternar el perfil visualmente
  seleccionarPerfil(perfil: string): void {
    this.perfilSeleccionado = perfil;
  }

  // Método que se ejecuta al enviar el formulario
  onLogin(): void {
    this.errorUsuario.set(this.credentials.username.trim() ? '' : 'Escribe tu usuario.');
    this.errorPassword.set(this.credentials.password ? '' : 'Escribe tu contraseña.');
    this.errorMessage.set('');
    if (this.errorUsuario() || this.errorPassword()) return;

    this.cargando.set(true);
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.cargando.set(false);
        // Gerente y administrador van al dashboard; el asesor, a su reporte
        this.router.navigate(['/', inicioPorRol()]);
      },
      error: (err) => {
        console.error('Error de autenticación:', err);
        this.cargando.set(false);
        this.errorMessage.set(err.status === 0
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.'
          : 'Usuario o contraseña incorrectos.');
      }
    });
  }
}
