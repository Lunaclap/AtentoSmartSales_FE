import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ClientFormComponent } from '../../../shared/components/client-form/client-form';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ClientFormComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent {
  mostrarFormulario = false;

  columnasClientes: string[] = [
    'CLIENTE',
    'ASESOR',
    'CAMPAÑA',
    'ESTADO',
    'ÚLTIMO CONTACTO',
    'PRÓXIMO SEGUIMIENTO',
    'ACCIÓN'
  ];

  clientesCartera = [
    { nombre: 'Víctor Flores Salas', tipo: 'Persona', doc: '11731842', asesor: 'Andrea Rojas', campana: 'Préstamos', estado: 'Contactado', claseEstado: 'text-muted', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Víctor Castillo Herrera', tipo: 'Persona', doc: '78771950', asesor: 'Diego Salazar', campana: 'Telefonía móvil', estado: 'Contactado', claseEstado: 'text-muted', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 2 d' },
    { nombre: 'Constructora Surco S.A.C.', tipo: 'Empresa', doc: '20144198825', asesor: 'Valeria Chávez', campana: 'Seguros de salud', estado: 'Cerrado', claseEstado: 'text-success', ultimoContacto: 'Hoy', proximoSeguimiento: '—' },
    { nombre: 'Ana Ponce Díaz', tipo: 'Persona', doc: '14323886', asesor: 'Kevin Torres', campana: 'Préstamos', estado: 'Contactado', claseEstado: 'text-muted', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 5 d' },
    { nombre: 'Rosa Vera Torres', tipo: 'Persona', doc: '23771659', asesor: 'Camila Flores', campana: 'Telefonía móvil', estado: 'Contactado', claseEstado: 'text-muted', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 3 d' },
    { nombre: 'Raúl Medina Vargas', tipo: 'Persona', doc: '12885357', asesor: 'Valeria Chávez', campana: 'Seguros de salud', estado: 'Contactado', claseEstado: 'text-muted', ultimoContacto: 'Hoy', proximoSeguimiento: 'En 1 d' }
  ];

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}