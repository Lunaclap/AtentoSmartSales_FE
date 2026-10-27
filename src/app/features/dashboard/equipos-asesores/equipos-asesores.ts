import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-equipos-asesores',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, KpiCardComponent, DataTableComponent],
  templateUrl: './equipos-asesores.html',
  styleUrl: './equipos-asesores.css'
})
export class EquiposAsesoresComponent {
  columnasAsesores: string[] = [
    'ASESOR',
    'EQUIPO',
    'CAMPAÑA',
    'GESTIONES',
    'VENTAS',
    'CONVERSIÓN',
    'AVANCE DE META',
    'ESTADO'
  ];

  asesores = [
    { nombre: 'Diego Salazar', equipo: 'Lima Este', campana: 'Telefonía móvil', gestiones: 335, ventas: '53 / 39', conversion: '15,8 %', avance: '138 %', anchoAvance: '100%', estado: '✓ En meta' },
    { nombre: 'Fiorella Vega', equipo: 'Remoto', campana: 'Telefonía móvil', gestiones: 313, ventas: '40 / 39', conversion: '12,8 %', avance: '104 %', anchoAvance: '100%', estado: '✓ En meta' },
    { nombre: 'Luis Paredes', equipo: 'Lima Centro', campana: 'Telefonía móvil', gestiones: 304, ventas: '36 / 36', conversion: '11,8 %', avance: '101 %', anchoAvance: '100%', estado: '✓ En meta' }
  ];
}