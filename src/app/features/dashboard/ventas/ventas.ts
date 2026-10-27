import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { SaleFormComponent } from '../../../shared/components/sale-form/sale-form';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule, 
    FilterBarComponent, 
    KpiCardComponent, 
    DataTableComponent, 
    SaleFormComponent
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent {
  mostrarModalVenta = false;

  columnasVentas: string[] = [
    'ID VENTA',
    'CLIENTE',
    'ASESOR',
    'CAMPAÑA',
    'MONTO',
    'FECHA',
    'ESTADO'
  ];

  listaVentas = [
    { id: 'VNT-8492', cliente: 'Sofía Torres Silva', asesor: 'Camila Flores', campana: 'Telefonía móvil', monto: 'S/ 1,250', fecha: 'Hoy, 10:45 AM', estado: 'Aprobado' },
    { id: 'VNT-8491', cliente: 'Patricia Ponce Ramírez', asesor: 'Marisol Huamán', campana: 'Seguros de salud', monto: 'S/ 980', fecha: 'Hoy, 09:20 AM', estado: 'Aprobado' },
    { id: 'VNT-8490', cliente: 'Víctor Flores Castillo', asesor: 'Jorge Mamani', campana: 'Préstamos', monto: 'S/ 1,500', fecha: 'Ayer, 04:15 PM', estado: 'Pendiente' },
    { id: 'VNT-8489', cliente: 'Pedro Castillo Vera', asesor: 'Fiorella Vega', campana: 'Telefonía móvil', monto: 'S/ 1,100', fecha: 'Ayer, 02:00 PM', estado: 'Aprobado' }
  ];

  toggleModalVenta() {
    this.mostrarModalVenta = !this.mostrarModalVenta;
  }
}