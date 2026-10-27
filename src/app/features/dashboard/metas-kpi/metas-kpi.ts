import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-metas-kpi',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './metas-kpi.html',
  styleUrl: './metas-kpi.css'
})
export class MetasKpiComponent {
  columnasMetas: string[] = [
    'ASESOR',
    'EQUIPO',
    'CAMPAÑA',
    'META MENSUAL'
  ];

  asesoresMetas = [
    { nombre: 'Lucía Quispe', equipo: 'Lima Este', campana: 'Préstamos', metaMensual: 27 },
    { nombre: 'Diego Salazar', equipo: 'Lima Este', campana: 'Telefonía móvil', metaMensual: 40 },
    { nombre: 'Marisol Huamán', equipo: 'Lima Este', campana: 'Seguros de salud', metaMensual: 23 },
    { nombre: 'Renzo Cárdenas', equipo: 'Lima Este', campana: 'Préstamos', metaMensual: 26 },
    { nombre: 'Camila Flores', equipo: 'Lima Centro', campana: 'Telefonía móvil', metaMensual: 34 },
    { nombre: 'Jorge Mamani', equipo: 'Lima Centro', campana: 'Seguros de salud', metaMensual: 22 }
  ];
}