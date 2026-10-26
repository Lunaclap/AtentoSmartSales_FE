import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  // Filtros activos
  diasSeleccionados: number = 30;
  campanaSeleccionada: string = 'todas';
  equipoSeleccionado: string = 'todos';

  // Objeto dinámico con las métricas de las tarjetas KPI
  kpis = {
    ventas: 374,
    ventasVariacion: '+17,2 %',
    conversion: '9,7 %',
    conversionVariacion: '+11,9 %',
    promedio: 'S/ 1,270',
    promedioVariacion: '-0,8 %',
    metaCumplida: '112 %',
    metaTexto: '✓ En meta',
    metaValor: 'Meta: 333 ventas'
  };

  // Método que recalcula los datos al cambiar cualquier filtro
  onFiltroChange() {
    if (this.campanaSeleccionada === 'prestamos') {
      this.kpis = {
        ventas: 142,
        ventasVariacion: '+5,4 %',
        conversion: '9,1 %',
        conversionVariacion: '+2,1 %',
        promedio: 'S/ 2,400',
        promedioVariacion: '+3,0 %',
        metaCumplida: '98 %',
        metaTexto: 'Cerca de la meta',
        metaValor: 'Meta: 150 ventas'
      };
    } else if (this.campanaSeleccionada === 'telefonia') {
      this.kpis = {
        ventas: 185,
        ventasVariacion: '+22,5 %',
        conversion: '12,8 %',
        conversionVariacion: '+4,5 %',
        promedio: 'S/ 450',
        promedioVariacion: '+1,2 %',
        metaCumplida: '120 %',
        metaTexto: '✓ En meta',
        metaValor: 'Meta: 154 ventas'
      };
    } else if (this.campanaSeleccionada === 'seguros') {
      this.kpis = {
        ventas: 47,
        ventasVariacion: '-2,1 %',
        conversion: '7,2 %',
        conversionVariacion: '-1,5 %',
        promedio: 'S/ 1,100',
        promedioVariacion: '-0,5 %',
        metaCumplida: '85 %',
        metaTexto: 'En revisión',
        metaValor: 'Meta: 55 ventas'
      };
    } else {
      // Valores por defecto (Todas las campañas)
      this.kpis = {
        ventas: 374,
        ventasVariacion: '+17,2 %',
        conversion: '9,7 %',
        conversionVariacion: '+11,9 %',
        promedio: 'S/ 1,270',
        promedioVariacion: '-0,8 %',
        metaCumplida: '112 %',
        metaTexto: '✓ En meta',
        metaValor: 'Meta: 333 ventas'
      };
    }
  }

  seleccionarDias(dias: number) {
    this.diasSeleccionados = dias;
    this.onFiltroChange();
  }

  // Lista de asesores
  asesores = [
    { nombre: 'Diego Salazar', ventas: 53, ancho: '100%' },
    { nombre: 'Fiorella Vega', ventas: 40, ancho: '75%' },
    { nombre: 'Luis Paredes', ventas: 36, ancho: '68%' },
    { nombre: 'Lucía Quispe', ventas: 35, ancho: '65%' },
    { nombre: 'Camila Flores', ventas: 35, ancho: '65%' }
  ];

  // Lista de clientes
  clientesPendientes = [
    { nombre: 'Sofía Torres Silva', codigo: '53348699', asesor: 'Camila Flores', campana: 'Telefonía móvil', ultimoContacto: 'Hace 12 d', seguimiento: 'Vencido hace 11 d', estado: 'Contactado' },
    { nombre: 'Patricia Ponce Ramírez', codigo: '56770876', asesor: 'Marisol Huamán', campana: 'Seguros de salud', ultimoContacto: 'Hace 13 d', seguimiento: 'Vencido hace 10 d', estado: 'Interesado' }
  ];
}