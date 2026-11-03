import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { SaleFormComponent, VentaNueva } from '../../../shared/components/sale-form/sale-form';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { ToastService } from '../../../shared/components/toast/toast';
import { DemoDataService, FILTRO_INICIAL, Filtro } from '../../../core/services/demo-data.service';
import { Pill, money, num } from '../../../shared/utils/formato';

interface FilaVenta { id: string; cliente: string; doc: string; asesor: string; campana: string; producto: string; monto: number; fecha: string; estado: string }

const ESTADO_PILL: Record<string, Pill> = {
  Aprobado: { cls: 'ok', icon: 'check', label: 'Aprobado' },
  Pendiente: { cls: 'warn', icon: 'alert', label: 'Pendiente' },
  Observado: { cls: 'crit', icon: 'x', label: 'Observado' }
};

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FilterBarComponent,
    KpiCardComponent,
    DataTableComponent,
    SaleFormComponent,
    PageHeadComponent,
    ChartPanelComponent,
    PillComponent,
    CampChipComponent
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent {
  data = inject(DemoDataService);
  private toast = inject(ToastService);
  num = num; money = money;
  estadoPill = (e: string) => ESTADO_PILL[e];

  mostrarModalVenta = signal(false);
  filtro = signal<Filtro>(FILTRO_INICIAL);
  /** Ventas registradas en esta sesión desde el formulario; se muestran primero. */
  nuevas = signal<FilaVenta[]>([]);

  columnasVentas: string[] = [
    'ID venta',
    'Cliente',
    'Asesor',
    'Campaña',
    'Producto',
    'Monto',
    'Fecha',
    'Estado'
  ];

  vm = computed(() => {
    const f = this.filtro(), ids = this.data.idsFiltrados(f), [s, e] = this.data.rango(f.dias);
    const a = this.data.agregar(s, e, ids);
    const filas: FilaVenta[] = this.data.ventas(ids, s).map(({ cliente, h }, i) => ({
      id: 'VNT-' + (8500 - i),
      cliente: cliente.nombre,
      doc: cliente.doc,
      asesor: this.data.asesor(cliente.asesor).n,
      campana: cliente.camp,
      producto: h.prod,
      monto: h.val,
      fecha: this.data.rel(h.d),
      estado: 'Aprobado'
    }));
    return { a, dias: f.dias, filas: [...this.nuevas(), ...filas] };
  });

  toggleModalVenta() {
    this.mostrarModalVenta.update(v => !v);
  }

  onFiltroCambio(f: Filtro) {
    this.filtro.set(f);
  }

  registrarVenta(v: VentaNueva) {
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');
    this.nuevas.update(l => [{
      id: 'VNT-' + (8501 + l.length),
      cliente: v.nombreCliente,
      doc: v.nroDoc,
      asesor: this.data.asesor(v.asesor).n,
      campana: v.campana,
      producto: v.producto,
      monto: Number(v.monto),
      fecha: 'Hoy, ' + hora,
      estado: v.estado
    }, ...l]);
    this.mostrarModalVenta.set(false);
    this.toast.show('Venta registrada: ' + v.nombreCliente);
  }
}
