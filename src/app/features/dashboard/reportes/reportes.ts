import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {
  diasSeleccionados: number = 30;
  campanaSeleccionada: string = 'todas';
  equipoSeleccionado: string = 'todos';
  agruparPor: string = 'asesor';

  seleccionarDias(dias: number) {
    this.diasSeleccionados = dias;
  }

  // Datos simulados del reporte detallado
  reportesData = [
    { asesor: 'Lucía Quispe', gestiones: 337, ventas: 35, conversion: '10,4 %', ingresoEst: 'S/ 57,080', ventaProm: 'S/ 1,631', meta: '135 %' },
    { asesor: 'Diego Salazar', gestiones: 335, ventas: 53, conversion: '15,8 %', ingresoEst: 'S/ 66,750', ventaProm: 'S/ 1,259', meta: '138 %' },
    { asesor: 'Marisol Huamán', gestiones: 319, ventas: 22, conversion: '6,9 %', ingresoEst: 'S/ 16,760', ventaProm: 'S/ 762', meta: '99 %' },
    { asesor: 'Renzo Cárdenas', gestiones: 306, ventas: 25, conversion: '8,2 %', ingresoEst: 'S/ 41,220', ventaProm: 'S/ 1,649', meta: '100 %' },
    { asesor: 'Camila Flores', gestiones: 326, ventas: 35, conversion: '10,7 %', ingresoEst: 'S/ 44,280', ventaProm: 'S/ 1,265', meta: '107 %' },
    { asesor: 'Jorge Mamani', gestiones: 315, ventas: 23, conversion: '7,3 %', ingresoEst: 'S/ 18,410', ventaProm: 'S/ 800', meta: '109 %' },
    { asesor: 'Andrea Rojas', gestiones: 324, ventas: 33, conversion: '10,2 %', ingresoEst: 'S/ 57,000', ventaProm: 'S/ 1,727', meta: '122 %' },
    { asesor: 'Luis Paredes', gestiones: 304, ventas: 36, conversion: '11,8 %', ingresoEst: 'S/ 44,640', ventaProm: 'S/ 1,240', meta: '101 %' },
    { asesor: 'Valeria Chávez', gestiones: 324, ventas: 22, conversion: '6,8 %', ingresoEst: 'S/ 16,230', ventaProm: 'S/ 738', meta: '104 %' },
    { asesor: 'Kevin Torres', gestiones: 318, ventas: 24, conversion: '7,5 %', ingresoEst: 'S/ 40,820', ventaProm: 'S/ 1,701', meta: '100 %' },
    { asesor: 'Fiorella Vega', gestiones: 313, ventas: 40, conversion: '12,8 %', ingresoEst: 'S/ 51,300', ventaProm: 'S/ 1,283', meta: '104 %' }
  ];

  copiarCsv() {
    alert('¡Datos del reporte copiados como CSV al portapapeles!');
  }
}