import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  perfilSeleccionado: 'gerente' | 'asesor' = 'gerente';

  usuario = 'rmedina';
  contrasena = '';

  seleccionarPerfil(perfil: 'gerente' | 'asesor') {
    this.perfilSeleccionado = perfil;
    if (perfil === 'gerente') {
      this.usuario = 'rmedina'; 
    } else {
      this.usuario = 'asesor_ventas';
    }
  }

  onIngresar() {
    console.log('Perfil:', this.perfilSeleccionado);
    console.log('Usuario:', this.usuario);
    alert(`¡Bienvenido! Ingresando como ${this.perfilSeleccionado}`);
  }
}