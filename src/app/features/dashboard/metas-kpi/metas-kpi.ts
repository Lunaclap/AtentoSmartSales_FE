import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-metas-kpi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './metas-kpi.html',
  styleUrl: './metas-kpi.css'
})
export class MetasKpiComponent {
  // Lista de asesores con sus metas mensuales editables
  metasAsesores = [
    { asesor: 'Lucía Quispe', equipo: 'Lima Este', campana: 'Préstamos', metaMensual: 27 },
    { asesor: 'Diego Salazar', equipo: 'Lima Este', campana: 'Telefonía móvil', metaMensual: 40 },
    { asesor: 'Marisol Huamán', equipo: 'Lima Este', campana: 'Seguros de salud', metaMensual: 23 },
    { asesor: 'Renzo Cárdenas', equipo: 'Lima Este', campana: 'Préstamos', metaMensual: 26 },
    { asesor: 'Camila Flores', equipo: 'Lima Centro', campana: 'Telefonía móvil', metaMensual: 34 },
    { asesor: 'Jorge Mamani', equipo: 'Lima Centro', campana: 'Seguros de salud', metaMensual: 22 },
    { asesor: 'Andrea Rojas', equipo: 'Lima Centro', campana: 'Préstamos', metaMensual: 28 },
    { asesor: 'Luis Paredes', equipo: 'Lima Centro', campana: 'Telefonía móvil', metaMensual: 37 },
    { asesor: 'Valeria Chávez', equipo: 'Remoto', campana: 'Seguros de salud', metaMensual: 22 },
    { asesor: 'Kevin Torres', equipo: 'Remoto', campana: 'Préstamos', metaMensual: 25 },
    { asesor: 'Fiorella Vega', equipo: 'Remoto', campana: 'Telefonía móvil', metaMensual: 40 }
  ];

  guardarMetas() {
    alert('¡Las metas mensuales se han actualizado con éxito!');
  }
}