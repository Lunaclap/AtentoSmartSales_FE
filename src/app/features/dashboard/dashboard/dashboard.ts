import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    KpiCardComponent, 
    FilterBarComponent, 
    ChartPanelComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  kpis = {
    ventas: 374,
    ventasVariacion: '+17,2 %',
    conversion: '9,7 %',
    conversionVariacion: '+11,9 %',
    promedio: 'S/ 1,270',
    promedioVariacion: '-0,8 %',
    metaCumplida: '112 %',
    metaTexto: 'En meta',
    metaValor: 'Meta: 333 ventas'
  };

  asesores = [
    { nombre: 'Diego Salazar', ventas: 53, ancho: '100%' },
    { nombre: 'Fiorella Vega', ventas: 40, ancho: '75%' },
    { nombre: 'Luis Paredes', ventas: 36, ancho: '68%' },
    { nombre: 'Lucía Quispe', ventas: 35, ancho: '66%' },
    { nombre: 'Camila Flores', ventas: 35, ancho: '66%' },
    { nombre: 'Andrea Rojas', ventas: 33, ancho: '62%' },
    { nombre: 'Mateo Ramos', ventas: 26, ancho: '48%' },
    { nombre: 'Renzo Cárdenas', ventas: 25, ancho: '45%' },
    { nombre: 'Kevin Torres', ventas: 24, ancho: '43%' },
    { nombre: 'Jorge Mamani', ventas: 23, ancho: '40%' },
    { nombre: 'Marisol Huamán', ventas: 22, ancho: '38%' },
    { nombre: 'Valeria Chávez', ventas: 22, ancho: '38%' }
  ];

  clientesPendientes = [
    { nombre: 'Sofía Torres Silva', codigo: '53348699', asesor: 'Camila Flores', campana: 'Telefonía móvil', ultimoContacto: 'Hace 12 d', seguimiento: 'Vencido hace 11 d', estado: 'Contactado' },
    { nombre: 'Patricia Ponce Ramírez', codigo: '56770876', asesor: 'Marisol Huamán', campana: 'Seguros de salud', ultimoContacto: 'Hace 13 d', seguimiento: 'Vencido hace 10 d', estado: 'Interesado' },
    { nombre: 'Víctor Flores Castillo', codigo: '27470059', asesor: 'Jorge Mamani', campana: 'Seguros de salud', ultimoContacto: 'Hace 11 d', seguimiento: 'Vencido hace 10 d', estado: 'Contactado' },
    { nombre: 'Pedro Castillo Vera', codigo: '66379766', asesor: 'Fiorella Vega', campana: 'Telefonía móvil', ultimoContacto: 'Hace 11 d', seguimiento: 'Vencido hace 10 d', estado: 'Contactado' },
    { nombre: 'María Salas Ramírez', codigo: '44827356', asesor: 'Mateo Ramos', campana: 'Seguros de salud', ultimoContacto: 'Hace 12 d', seguimiento: 'Vencido hace 10 d', estado: 'Interesado' },
    { nombre: 'Constructora Surco S.A.C.', codigo: '20288588494', asesor: 'Jorge Mamani', campana: 'Seguros de salud', ultimoContacto: 'Hace 13 d', seguimiento: 'Vencido hace 10 d', estado: 'Contactado' }
  ];

  onFiltroCambio(filtro: any) {
    console.log('Filtros aplicados:', filtro);
  }
}