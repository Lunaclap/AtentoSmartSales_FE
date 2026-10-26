import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-equipos-asesores',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './equipos-asesores.html',
  styleUrl: './equipos-asesores.css'
})
export class EquiposAsesoresComponent {
  diasSeleccionados: number = 30;
  campanaSeleccionada: string = 'todas';
  equipoSeleccionado: string = 'todos';

  seleccionarDias(dias: number) {
    this.diasSeleccionados = dias;
  }

  // Datos de rendimiento por equipo
  equipos = [
    { nombre: 'Lima Este', ventas: 135, porcentaje: '121 %', ancho: '100%', conversion: '10,4 %', asesoresCount: 4, estado: 'En meta' },
    { nombre: 'Lima Centro', ventas: 127, porcentaje: '109 %', ancho: '90%', conversion: '10,0 %', asesoresCount: 4, estado: 'En meta' },
    { nombre: 'Remoto', ventas: 112, porcentaje: '107 %', ancho: '85%', conversion: '8,7 %', asesoresCount: 4, estado: 'En meta' }
  ];

  // Datos detallados de desempeño por asesor
  asesoresDetalle = [
    { nombre: 'Diego Salazar', equipo: 'Lima Este', campana: 'Telefonía móvil', gestiones: 335, ventas: '53 / 39', conversion: '15,8 %', avance: '138 %', anchoAvance: '100%', estado: 'En meta' },
    { nombre: 'Fiorella Vega', equipo: 'Remoto', campana: 'Telefonía móvil', gestiones: 313, ventas: '40 / 39', conversion: '12,8 %', avance: '104 %', anchoAvance: '75%', estado: 'En meta' },
    { nombre: 'Luis Paredes', equipo: 'Lima Centro', campana: 'Telefonía móvil', gestiones: 304, ventas: '36 / 36', conversion: '11,8 %', avance: '101 %', anchoAvance: '72%', estado: 'En meta' },
    { nombre: 'Lucía Quispe', equipo: 'Lima Este', campana: 'Préstamos', gestiones: 337, ventas: '35 / 26', conversion: '10,4 %', avance: '135 %', anchoAvance: '95%', estado: 'En meta' },
    { nombre: 'Camila Flores', equipo: 'Lima Centro', campana: 'Telefonía móvil', gestiones: 326, ventas: '35 / 33', conversion: '10,7 %', avance: '107 %', anchoAvance: '78%', estado: 'En meta' },
    { nombre: 'Andrea Rojas', equipo: 'Lima Centro', campana: 'Préstamos', gestiones: 324, ventas: '33 / 27', conversion: '10,2 %', avance: '122 %', anchoAvance: '88%', estado: 'En meta' },
    { nombre: 'Mateo Ramos', equipo: 'Remoto', campana: 'Seguros de salud', gestiones: 331, ventas: '26 / 21', conversion: '7,9 %', avance: '123 %', anchoAvance: '89%', estado: 'En meta' },
    { nombre: 'Renzo Cárdenas', equipo: 'Lima Este', campana: 'Préstamos', gestiones: 306, ventas: '25 / 25', conversion: '8,2 %', avance: '100 %', anchoAvance: '70%', estado: 'En riesgo' },
    { nombre: 'Kevin Torres', equipo: 'Remoto', campana: 'Préstamos', gestiones: 318, ventas: '24 / 24', conversion: '7,5 %', avance: '100 %', anchoAvance: '70%', estado: 'En riesgo' }
  ];
}