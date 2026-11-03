import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PillComponent } from '../../../shared/components/pill/pill';
import { ToastService } from '../../../shared/components/toast/toast';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { FilaAsesor, ReporteAsesores } from '../../../core/models/comercial.model';
import { metaPill, money, num, pc, periodoActual, periodos } from '../../../shared/utils/formato';

/** Reporte del gerente: tabla resumen por asesor con filtros por campaña y modalidad (REQ-26). */
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, RouterLink, NgTemplateOutlet, PageHeadComponent, DataTableComponent, PillComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {
  private api = inject(ComercialService);
  private toast = inject(ToastService);
  num = num; money = money; pc = pc; metaPill = metaPill;

  catalogo = this.api.catalogo;
  meses = periodos();
  periodo = signal(periodoActual());
  campanaId = signal<number | null>(null);
  modalidadId = signal<number | null>(null);

  r = signal<ReporteAsesores | null>(null);
  cargando = signal(true);
  error = signal('');

  columnas = ['Asesor', 'Gestiones', 'Cierres', 'Pendientes', 'Monto cerrado', 'Venta promedio', 'Meta', 'Avance de meta', ''];
  derecha = ['Gestiones', 'Cierres', 'Pendientes', 'Monto cerrado', 'Venta promedio', 'Meta'];

  ngOnInit() {
    this.api.cargarCatalogos().subscribe({ error: () => {} });
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.api.reporteAsesores(this.periodo(), this.campanaId(), this.modalidadId()).subscribe({
      next: r => { this.r.set(r); this.cargando.set(false); },
      error: e => { this.error.set(mensajeError(e, 'No se pudo cargar el reporte.')); this.cargando.set(false); }
    });
  }

  hayFiltros() { return this.campanaId() !== null || this.modalidadId() !== null; }

  limpiar() {
    this.campanaId.set(null);
    this.modalidadId.set(null);
    this.cargar();
  }

  copiarCsv() {
    const r = this.r();
    if (!r) return;
    const fila = (f: FilaAsesor) => [f.asesor, f.gestiones, f.cierres, f.pendientes, f.monto.toFixed(2), f.ticketPromedio.toFixed(2), f.meta, (f.avanceMeta * 100).toFixed(1)].join(';');
    const csv = ['Asesor;Gestiones;Cierres;Pendientes;Monto cerrado;Venta promedio;Meta;Avance %', ...r.filas.map(fila), fila(r.total)].join('\n');
    navigator.clipboard.writeText(csv).then(
      () => this.toast.show('Tabla copiada como CSV.'),
      () => this.toast.show('No se pudo copiar al portapapeles.', true));
  }
}
