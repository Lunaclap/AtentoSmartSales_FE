import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { ToastService } from '../../../shared/components/toast/toast';
import { DemoDataService, FILTRO_INICIAL, Filtro } from '../../../core/services/demo-data.service';
import { money, num, pc } from '../../../shared/utils/formato';

type Grupo = 'asesor' | 'equipo' | 'campana' | 'semana';
interface Fila { k: string; g: number; v: number; mon: number; meta: number }

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterBarComponent, DataTableComponent, PageHeadComponent, ChartPanelComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {
  data = inject(DemoDataService);
  private toast = inject(ToastService);
  num = num; money = money; pc = pc;

  filtro = signal<Filtro>(FILTRO_INICIAL);
  grupo = signal<Grupo>('asesor');
  grupos: { v: Grupo; t: string }[] = [
    { v: 'asesor', t: 'Asesor' },
    { v: 'equipo', t: 'Equipo' },
    { v: 'campana', t: 'Campaña' },
    { v: 'semana', t: 'Semana' }
  ];

  etiqueta = computed(() => this.grupos.find(g => g.v === this.grupo())!.t);
  columnasReporte = computed(() => [this.etiqueta(), 'Gestiones', 'Ventas', 'Conversión', 'Ingreso est.', 'Venta prom.', 'Meta']);
  derecha = ['Gestiones', 'Ventas', 'Conversión', 'Ingreso est.', 'Venta prom.', 'Meta'];

  filas = computed<Fila[]>(() => {
    this.data.versionMetas();
    const f = this.filtro(), ids = this.data.idsFiltrados(f), [s, e] = this.data.rango(f.dias);
    const out: Fila[] = [];
    const deGrupo = (k: string, t: number[]) => {
      if (!t.length) return;
      const a = this.data.agregar(s, e, t);
      out.push({ k, g: a.g, v: a.v, mon: a.mon, meta: a.meta });
    };
    switch (this.grupo()) {
      case 'asesor': {
        const a = this.data.agregar(s, e, ids);
        ids.forEach(i => {
          const p = a.per[i];
          out.push({ k: this.data.asesor(i).n, g: p.g, v: p.v, mon: p.mon, meta: this.data.asesor(i).meta * a.wd / this.data.DIAS_LAB_MES });
        });
        break;
      }
      case 'equipo':
        this.data.equipos.forEach(eq => deGrupo(eq, ids.filter(i => this.data.asesor(i).eq === eq)));
        break;
      case 'campana':
        this.data.campanas.forEach(c => deGrupo(c.n, ids.filter(i => this.data.asesor(i).camp === c.id)));
        break;
      case 'semana':
        for (let d = s; d <= e; d += 7) {
          const a = this.data.agregar(d, Math.min(d + 6, e), ids);
          out.push({ k: 'Semana del ' + this.data.dm(d), g: a.g, v: a.v, mon: a.mon, meta: a.meta });
        }
        break;
    }
    return out;
  });

  total = computed<Fila>(() => this.filas().reduce(
    (t, x) => ({ k: 'Total', g: t.g + x.g, v: t.v + x.v, mon: t.mon + x.mon, meta: t.meta + x.meta }),
    { k: 'Total', g: 0, v: 0, mon: 0, meta: 0 }
  ));

  onFiltroCambio(f: Filtro) {
    this.filtro.set(f);
  }

  copiarCsv() {
    const lineas = [
      [this.etiqueta(), 'Gestiones', 'Ventas', 'Conversión', 'Ingreso estimado', 'Venta promedio'].join(';'),
      ...this.filas().map(x => [x.k, x.g, x.v, pc(x.g ? x.v / x.g : 0), Math.round(x.mon), Math.round(x.v ? x.mon / x.v : 0)].join(';'))
    ];
    navigator.clipboard.writeText(lineas.join('\n')).then(
      () => this.toast.show('Reporte copiado. Pégalo en Excel o en tu correo.'),
      () => this.toast.show('No se pudo copiar. Selecciona la tabla y cópiala manualmente.', true)
    );
  }
}
