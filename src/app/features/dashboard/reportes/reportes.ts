import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, DataTableComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {
  columnasReporte: string[] = [
    'ASESOR',
    'GESTIONES',
    'VENTAS',
    'CONVERSIÓN',
    'INGRESO EST.',
    'VENTA PROM.',
    'META'
  ];

  reportesAsesores = [
    { nombre: 'Lucía Quispe', gestiones: 337, ventas: 35, conversion: '10,4 %', ingreso: 'S/ 57,080', promedio: 'S/ 1,631', meta: '135 %' },
    { nombre: 'Diego Salazar', gestiones: 335, ventas: 53, conversion: '15,8 %', ingreso: 'S/ 66,750', promedio: 'S/ 1,259', meta: '138 %' },
    { nombre: 'Marisol Huamán', gestiones: 319, ventas: 22, conversion: '6,9 %', ingreso: 'S/ 16,760', promedio: 'S/ 762', meta: '99 %' },
    { nombre: 'Renzo Cárdenas', gestiones: 306, ventas: 25, conversion: '8,2 %', ingreso: 'S/ 41,220', promedio: 'S/ 1,649', meta: '100 %' },
    { nombre: 'Camila Flores', gestiones: 326, ventas: 35, conversion: '10,7 %', ingreso: 'S/ 44,280', promedio: 'S/ 1,265', meta: '107 %' }
  ];
}