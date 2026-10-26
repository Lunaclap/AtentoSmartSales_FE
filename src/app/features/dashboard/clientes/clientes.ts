import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent {
  busqueda: string = '';
  estadoSeleccionado: string = 'todos';

  // Cartera de clientes de ejemplo
  clientes = [
    { nombre: 'Víctor Flores Salas', tipoDoc: 'Persona', documento: '11731842', asesor: 'Andrea Rojas', campana: 'Préstamos', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Víctor Castillo Herrera', tipoDoc: 'Persona', documento: '78771950', asesor: 'Diego Salazar', campana: 'Telefonía móvil', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Constructora Surco S.A.C.', tipoDoc: 'Empresa', documento: '20144198825', asesor: 'Valeria Chávez', campana: 'Seguros de salud', estado: 'Cerrado', ultimoContacto: 'Hoy', proximoSeguimiento: '—' },
    { nombre: 'Ana Ponce Díaz', tipoDoc: 'Persona', documento: '14323886', asesor: 'Kevin Torres', campana: 'Préstamos', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 5 d' },
    { nombre: 'Rosa Vera Torres', tipoDoc: 'Persona', documento: '23771659', asesor: 'Camila Flores', campana: 'Telefonía móvil', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 3 d' },
    { nombre: 'Raúl Medina Vargas', tipoDoc: 'Persona', documento: '12885357', asesor: 'Valeria Chávez', campana: 'Seguros de salud', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 1 d' },
    { nombre: 'Carlos Vera Vera', tipoDoc: 'Persona', documento: '21896472', asesor: 'Fiorella Vega', campana: 'Telefonía móvil', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 5 d' },
    { nombre: 'Héctor Aguilar Medina', tipoDoc: 'Persona', documento: '10096893', asesor: 'Jorge Mamani', campana: 'Seguros de salud', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 1 d' },
    { nombre: 'Gladys Herrera Gómez', tipoDoc: 'Persona', documento: '22069446', asesor: 'Kevin Torres', campana: 'Préstamos', estado: 'Contactado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Sofía Díaz Salas', tipoDoc: 'Persona', documento: '73838502', asesor: 'Lucía Quispe', campana: 'Préstamos', estado: 'Interesado', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Servicios Pacífico S.A.C.', tipoDoc: 'Empresa', documento: '20556677881', asesor: 'Luis Paredes', campana: 'Telefonía móvil', estado: 'Interesado', ultimoContacto: 'Ayer', proximoSeguimiento: 'En 2 d' }
  ];

  nuevoCliente() {
    alert('Abriendo formulario para registrar un nuevo cliente...');
  }
}