import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { LineChartComponent, SparkComponent } from '../../../shared/components/line-chart/line-chart';
import { PillComponent } from '../../../shared/components/pill/pill';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { ResumenGerente } from '../../../core/models/comercial.model';
import { colorCampana, dec, metaPill, money, num, pc, periodoActual, periodos } from '../../../shared/utils/formato';
import { serieDiaria } from '../reportes/detalle-asesor';

const COLOR_ESTADO: Record<string, string> = {
  'Aprobado': 'var(--ok)', 'Contactado': 'var(--c1)', 'No contactado': 'var(--muted)', 'Rechazado': 'var(--c2)', 'Black List': 'var(--crit)'
};

/** Dashboard del gerente: resumen del mes con datos reales del backend. */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, PageHeadComponent, KpiCardComponent, ChartPanelComponent, LineChartComponent, SparkComponent, PillComponent, TooltipDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private api = inject(ComercialService);
  num = num; pc = pc; money = money; dec = dec; metaPill = metaPill; color = colorCampana;

  meses = periodos();
  periodo = signal(periodoActual());
  d = signal<ResumenGerente | null>(null);
  error = signal('');

  serie = computed(() => { const d = this.d(); return d ? serieDiaria(d.dias, d.meta) : []; });
  spark = computed(() => this.d()?.dias.map(x => x.cierres) ?? []);
  sparkGestiones = computed(() => this.d()?.dias.map(x => x.gestiones) ?? []);

  estados = computed(() => {
    const e = this.d()?.clientesPorEstado ?? {};
    const total = Object.values(e).reduce((t, v) => t + v, 0) || 1;
    const max = Math.max(1, ...Object.values(e));
    return Object.entries(e).map(([n, v]) => ({ n, v, w: v / max * 100, c: COLOR_ESTADO[n] ?? 'var(--c1)', tip: `${n}: ${v} clientes (${pc(v / total, 0)})` }));
  });

  campanas = computed(() => {
    const l = this.d()?.campanas ?? [];
    const max = Math.max(1, ...l.map(c => c.cierres));
    return l.map(c => ({ ...c, w: c.cierres / max * 100, tip: `${c.campana}: ${c.cierres} cierres · conversión ${pc(c.conversion)}` }));
  });

  ngOnInit() { this.cargar(); }

  cargar() {
    this.d.set(null);
    this.error.set('');
    this.api.resumen(this.periodo()).subscribe({
      next: d => this.d.set(d),
      error: e => this.error.set(mensajeError(e, 'No se pudo cargar el resumen.'))
    });
  }

  variacion(a: number, b: number) {
    if (!b) return '';
    const v = (a - b) / b;
    return (v >= 0 ? '+' : '−') + pc(Math.abs(v), 0);
  }
}
