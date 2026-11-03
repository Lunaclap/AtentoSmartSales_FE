import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { CampChipComponent } from '../../../shared/components/pill/pill';
import { ToastService } from '../../../shared/components/toast/toast';
import { DemoDataService } from '../../../core/services/demo-data.service';
import { money } from '../../../shared/utils/formato';

@Component({
  selector: 'app-metas-kpi',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, PageHeadComponent, CampChipComponent],
  templateUrl: './metas-kpi.html',
  styleUrl: './metas-kpi.css'
})
export class MetasKpiComponent {
  data = inject(DemoDataService);
  private toast = inject(ToastService);

  columnasMetas: string[] = [
    'Asesor',
    'Equipo',
    'Campaña',
    'Meta mensual'
  ];

  asesoresMetas = this.data.asesores.map(a => ({ ...a, metaMensual: a.meta }));
  error = signal('');

  definiciones = [
    { t: 'Tasa de conversión', d: 'Ventas ÷ gestiones realizadas' },
    { t: 'Venta promedio', d: 'Ingreso estimado ÷ ventas cerradas' },
    { t: 'Meta cumplida', d: `Ventas ÷ (meta mensual × días laborables del periodo ÷ ${this.data.DIAS_LAB_MES})` },
    { t: 'Contacto efectivo', d: 'Gestión cuyo resultado no es «No contesta»' },
    { t: 'Comisión estimada', d: `Regla de ejemplo: ${money(this.data.COMISION)} por venta` }
  ];

  guardar() {
    const metas = this.asesoresMetas.map(a => Number(a.metaMensual));
    if (metas.some(x => !Number.isInteger(x) || x < 1 || x > 200)) {
      this.error.set('Cada meta debe ser un número entero entre 1 y 200.');
      return;
    }
    this.error.set('');
    this.data.guardarMetas(metas);
    this.toast.show('Metas guardadas. Los indicadores se recalcularon.');
  }
}
