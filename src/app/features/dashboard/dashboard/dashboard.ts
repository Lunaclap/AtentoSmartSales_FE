import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { LineChartComponent, SparkComponent } from '../../../shared/components/line-chart/line-chart';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ClientDrawerComponent } from '../../../shared/components/client-drawer/client-drawer';
import { Cliente, DemoDataService, FILTRO_INICIAL, Filtro } from '../../../core/services/demo-data.service';
import { DIAS, estadoPill, metaPill, money, num, pc } from '../../../shared/utils/formato';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    KpiCardComponent,
    FilterBarComponent,
    ChartPanelComponent,
    LineChartComponent,
    SparkComponent,
    PageHeadComponent,
    PillComponent,
    CampChipComponent,
    TooltipDirective,
    DataTableComponent,
    ClientDrawerComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  data = inject(DemoDataService);
  num = num; money = money; pc = pc; metaPill = metaPill; estadoPill = estadoPill;

  filtro = signal<Filtro>(FILTRO_INICIAL);
  ficha = signal<Cliente | null>(null);
  rampa = ['var(--ramp1)', 'var(--ramp2)', 'var(--ramp3)', 'var(--ramp4)'];
  columnasPendientes = ['Cliente', 'Asesor', 'Campaña', 'Último contacto', 'Seguimiento', 'Estado', ''];

  vm = computed(() => {
    this.data.versionMetas();
    const f = this.filtro(), ids = this.data.idsFiltrados(f);
    const r = this.data.rango(f.dias);
    const cur = this.data.agregar(r[0], r[1], ids);
    // Con 90 días no hay un periodo anterior completo para comparar.
    const prev = f.dias <= 45 ? this.data.agregar(...this.data.rango(f.dias, 1), ids) : null;
    const ultimos = cur.days.slice(-14);
    const cumplida = cur.meta ? cur.v / cur.meta : 0;

    const serie = cur.days.map(x => ({
      etiqueta: this.data.dm(x.d),
      titulo: DIAS[this.data.diaSemana(x.d)] + ' ' + this.data.dm(x.d),
      v: x.v,
      m: cur.meta / cur.wd
    }));

    const embudo = [
      { n: 'Gestiones', v: cur.g },
      { n: 'Contactos efectivos', v: cur.ef },
      { n: 'Con interés', v: cur.it },
      { n: 'Ventas', v: cur.v }
    ].map(x => ({ ...x, w: cur.g ? Math.max(x.v / cur.g * 100, 1.5) : 0, tip: `<b>${x.n}</b><br>${num(x.v)} (${pc(cur.g ? x.v / cur.g : 0)} de las gestiones)` }));

    const ranking = ids.map(i => {
      const p = cur.per[i], m = this.data.asesor(i).meta * cur.wd / this.data.DIAS_LAB_MES;
      return { a: this.data.asesor(i), v: p.v, c: p.g ? p.v / p.g : 0, pm: m ? p.v / m : 0 };
    }).sort((a, b) => b.v - a.v);
    const mxv = Math.max(1, ...ranking.map(x => x.v));

    const campanas = this.data.campanas.map(c => {
      const idc = ids.filter(i => this.data.asesor(i).camp === c.id);
      if (!idc.length) return null;
      let g = 0, v = 0;
      idc.forEach(i => { g += cur.per[i].g; v += cur.per[i].v; });
      return { c, conv: g ? v / g : 0, v };
    }).filter(x => x !== null);
    const mc = Math.max(.01, ...campanas.map(x => x.conv));

    return {
      cur, prev, cumplida, serie,
      sub: 'Ventas cerradas frente a la meta diaria · ' + this.data.dm(r[0]) + ' al ' + this.data.dm(r[1]),
      sparkVentas: ultimos.map(x => x.v),
      sparkConv: ultimos.map(x => x.g ? x.v / x.g : 0),
      embudo,
      ranking: ranking.map(x => ({ ...x, w: x.v / mxv * 100, tip: `<b>${x.a.n}</b><br>${x.v} ventas · ${pc(x.pm, 0)} de la meta<br>Conversión ${pc(x.c)}` })),
      campanas: campanas.map(x => ({ ...x, h: x.conv / mc * 88, tip: `<b>${x.c.n}</b><br>${x.v} ventas · conversión ${pc(x.conv)}` })),
      pendientes: this.data.pendientes(ids).slice(0, 6)
    };
  });

  /** Variación frente al periodo anterior, p. ej. "+12,4 %". Vacío si no hay periodo comparable. */
  delta(cur: number, prev: number | undefined) {
    if (!prev) return '';
    const ch = (cur - prev) / prev;
    return (ch >= 0 ? '+' : '−') + Math.abs(ch * 100).toFixed(1).replace('.', ',') + ' %';
  }

  onFiltroCambio(filtro: Filtro) {
    this.filtro.set(filtro);
  }
}
