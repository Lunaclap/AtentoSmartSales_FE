import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { DetalleAsesor, PuntoDia } from '../../../core/models/comercial.model';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { LineChartComponent, PuntoSerie } from '../../../shared/components/line-chart/line-chart';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { DIAS, MESES, colorCampana, dec, fechaHora, metaPill, money, num, pc, periodoActual, periodos, ventaPill } from '../../../shared/utils/formato';

/** Serie diaria de cierres con la meta diaria (meta del mes ÷ días del mes). */
export function serieDiaria(dias: PuntoDia[], meta: number): PuntoSerie[] {
  if (!dias.length) return [];
  const [a, m] = dias[0].fecha.split('-').map(Number);
  const diaria = meta / new Date(a, m, 0).getDate();
  return dias.map(d => {
    const f = new Date(d.fecha + 'T00:00:00');
    return { etiqueta: f.getDate() + ' ' + MESES[f.getMonth()], titulo: DIAS[f.getDay()] + ' ' + f.getDate() + ' ' + MESES[f.getMonth()], v: d.cierres, m: diaria };
  });
}

/**
 * Reporte de un asesor en una sola vista (REQ-28): resumen, campañas con más cierres,
 * comparación con el mes anterior y avance diario. El gerente lo ve como "Ver detalle" (REQ-27).
 */
@Component({
  selector: 'app-detalle-asesor',
  standalone: true,
  imports: [FormsModule, RouterLink, PageHeadComponent, KpiCardComponent, ChartPanelComponent, DataTableComponent, LineChartComponent, CampChipComponent, PillComponent],
  template: `
    <app-page-head [titulo]="titulo()" [sub]="d()?.resumen?.asesor ? 'Reporte de ' + d()!.resumen.asesor : 'Resumen del mes, campañas y avance diario'" [fecha]="false">
      @if (volver()) { <a class="btn" routerLink="/reportes">← Volver a reportes</a> }
      <label class="sr" for="per">Mes</label>
      <select id="per" class="sel" [ngModel]="periodo()" (ngModelChange)="periodo.set($event); cargar()">
        @for (p of meses; track p.valor) { <option [value]="p.valor">{{ p.texto }}</option> }
      </select>
    </app-page-head>

    @if (error()) { <section class="card"><p class="empty">{{ error() }}</p></section> }
    @if (!d() && !error()) { <section class="card"><div class="empty"><div class="spin" role="status"></div>Cargando reporte…</div></section> }

    @if (d(); as d) {
      <section class="kpis" aria-label="Resumen">
        <app-kpi-card titulo="Cierres del mes" [valor]="num(d.resumen.cierres)" tip="Ventas en estado Cerrado registradas en el mes"
                      [variacion]="variacion(d.resumen.cierres, d.cierresMesAnterior)" [esPositivo]="d.resumen.cierres >= d.cierresMesAnterior">
          <span class="kpi-d">Mes anterior: {{ num(d.cierresMesAnterior) }}</span>
        </app-kpi-card>
        <app-kpi-card titulo="Avance de meta" [valor]="pc(d.resumen.avanceMeta, 0)" tip="Cierres ÷ meta del mes">
          <div class="prog" role="img" [attr.aria-label]="'Avance de meta ' + pc(d.resumen.avanceMeta, 0)">
            <i [style.width.%]="d.resumen.avanceMeta * 100 > 100 ? 100 : d.resumen.avanceMeta * 100"></i>
          </div>
          <span class="kpi-d"><app-pill [p]="metaPill(d.resumen.avanceMeta)" /> Meta: {{ num(d.resumen.meta) }} ventas</span>
        </app-kpi-card>
        <app-kpi-card titulo="Avance promedio diario" [valor]="dec(d.avancePromedioDiario)" unidad="cierres/día" tip="Cierres ÷ días transcurridos del mes">
          <span class="kpi-d">
            @if (d.diasRestantes > 0) {
              @if (d.ritmoNecesario > 0) { Necesitas {{ dec(d.ritmoNecesario) }} por día en los {{ d.diasRestantes }} días que quedan }
              @else { Meta alcanzada: quedan {{ d.diasRestantes }} días }
            } @else { Mes terminado }
          </span>
        </app-kpi-card>
        <app-kpi-card titulo="Monto de venta promedio" [valor]="money(d.resumen.ticketPromedio)" tip="Monto cerrado ÷ cierres">
          <span class="kpi-d">{{ money(d.resumen.monto) }} cerrados · {{ num(d.resumen.gestiones) }} gestiones · {{ num(d.resumen.pendientes) }} pendientes</span>
        </app-kpi-card>
      </section>

      <div class="g2">
        <app-chart-panel titulo="Avance diario" subtitulo="Cierres por día frente a la meta diaria">
          <div acciones class="legend"><span><i></i>Cierres</span><span><i class="dash"></i>Meta diaria</span></div>
          <app-line-chart [puntos]="serie()" nombre="Cierres" />
        </app-chart-panel>

        <app-chart-panel titulo="Campañas con más cierres" subtitulo="Cierres del mes por campaña">
          <div class="hbs">
            @for (c of d.campanas; track c.campana) {
              <div class="hb">
                <span class="hb-l">{{ c.campana }}</span>
                <span class="hb-t"><i [style.width.%]="maxCampana() ? c.cierres / maxCampana() * 100 : 0" [style.background]="color(c.campana)"></i></span>
                <span class="hb-v">{{ c.cierres }}</span>
              </div>
            }
          </div>
          <div class="list" style="margin-top:14px">
            <div class="li"><span>Cierres del mes anterior</span><b>{{ num(d.cierresMesAnterior) }}</b></div>
            <div class="li"><span>Diferencia</span><b>{{ d.resumen.cierres - d.cierresMesAnterior >= 0 ? '+' : '' }}{{ num(d.resumen.cierres - d.cierresMesAnterior) }}</b></div>
          </div>
        </app-chart-panel>
      </div>

      <app-chart-panel titulo="Ventas del mes" [subtitulo]="d.ventas.length + ' ventas (sin las devueltas a gestión)'">
        <app-data-table [columnas]="['ID venta', 'Cliente', 'Campaña', 'Modalidad', 'Monto', 'Fecha', 'Estado']" [derecha]="['Monto']">
          @for (v of d.ventas.slice(0, limite()); track v.id) {
            <tr>
              <td class="mono">#{{ v.id }}</td>
              <td class="nm"><b>{{ v.cliente }}</b><span>{{ v.documento }}</span></td>
              <td><app-camp-chip [nombre]="v.campana" /></td>
              <td>{{ v.modalidad }}</td>
              <td class="r mono">{{ money(v.monto) }}</td>
              <td>{{ fechaHora(v.fecha) }}</td>
              <td><app-pill [p]="ventaPill(v.estado)" /></td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="empty">No hay ventas en este mes.</td></tr>
          }
        </app-data-table>
        @if (d.ventas.length > limite()) {
          <div style="text-align:center;margin-top:12px">
            <button type="button" class="btn" (click)="limite.set(limite() + 20)">Mostrar más ({{ d.ventas.length - limite() }} restantes)</button>
          </div>
        }
      </app-chart-panel>
    }
  `
})
export class DetalleAsesorComponent implements OnInit {
  /** Id del asesor (vista del gerente); vacío = reporte propio del asesor. */
  id = input<string>();
  titulo = input('Mi reporte');
  volver = input(false);

  private api = inject(ComercialService);
  meses = periodos();
  periodo = signal(periodoActual());
  d = signal<DetalleAsesor | null>(null);
  error = signal('');
  limite = signal(20);

  num = num; pc = pc; dec = dec; money = money; fechaHora = fechaHora; metaPill = metaPill; ventaPill = ventaPill; color = colorCampana;

  serie = computed(() => { const d = this.d(); return d ? serieDiaria(d.dias, d.resumen.meta) : []; });
  maxCampana = computed(() => Math.max(0, ...(this.d()?.campanas ?? []).map(c => c.cierres)));

  ngOnInit() { this.cargar(); }

  cargar() {
    this.d.set(null);
    this.error.set('');
    const id = this.id();
    const obs: Observable<DetalleAsesor> = id ? this.api.detalleAsesor(+id, this.periodo()) : this.api.miReporte(this.periodo());
    obs.subscribe({ next: d => this.d.set(d), error: e => this.error.set(mensajeError(e, 'No se pudo cargar el reporte.')) });
  }

  variacion(a: number, b: number) {
    if (!b) return '';
    const v = (a - b) / b;
    return (v >= 0 ? '+' : '−') + pc(Math.abs(v), 0);
  }
}

/** Ruta /mi-reporte del asesor. */
@Component({
  selector: 'app-mi-reporte',
  standalone: true,
  imports: [DetalleAsesorComponent],
  template: `<app-detalle-asesor titulo="Mi reporte" />`
})
export class MiReporteComponent {}

/** Ruta /reportes/asesor/:id del gerente ("Ver detalle", REQ-27). */
@Component({
  selector: 'app-reporte-asesor',
  standalone: true,
  imports: [DetalleAsesorComponent],
  template: `<app-detalle-asesor [id]="id()" titulo="Detalle del asesor" [volver]="true" />`
})
export class ReporteAsesorComponent {
  id = input.required<string>();
}
