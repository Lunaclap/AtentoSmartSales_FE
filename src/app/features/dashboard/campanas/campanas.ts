import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { CampChipComponent } from '../../../shared/components/pill/pill';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { KpiCampana } from '../../../core/models/comercial.model';
import { colorCampana, money, num, pc, periodoActual, periodos } from '../../../shared/utils/formato';

/** KPIs por campaña (REQ-16, REQ-29). */
@Component({
  selector: 'app-campanas',
  standalone: true,
  imports: [FormsModule, PageHeadComponent, ChartPanelComponent, DataTableComponent, CampChipComponent, IconComponent],
  template: `
    <app-page-head titulo="KPIs por campaña" sub="Gestiones, cierres, conversión y monto de cada campaña" [fecha]="false">
      <label class="sr" for="cp">Mes</label>
      <select id="cp" class="sel" [ngModel]="periodo()" (ngModelChange)="periodo.set($event); cargar()">
        @for (p of meses; track p.valor) { <option [value]="p.valor">{{ p.texto }}</option> }
      </select>
    </app-page-head>

    @if (error()) { <section class="card"><p class="empty">{{ error() }}</p></section> }
    @if (cargando()) { <section class="card"><div class="empty"><div class="spin" role="status"></div>Cargando campañas…</div></section> }

    @if (!cargando() && lista().length) {
      <div class="g3">
        @for (c of lista(); track c.id; let i = $index) {
          <section class="card camp-card" [style.--cc]="color(c.campana)">
            <div class="card-h">
              <div>
                <h2>{{ c.campana }}</h2>
                <p class="sub">@if (i === 0 && c.cierres > 0) { Campaña con más cierres · }{{ num(c.gestiones) }} gestiones</p>
              </div>
            </div>
            <div class="cc-big">
              <b>{{ num(c.cierres) }}</b><span>cierres</span>
              @if (c.cierresMesAnterior) {
                <span class="kpi-d" style="display:inline-flex">
                  <span [class]="c.cierres >= c.cierresMesAnterior ? 'up' : 'down'">
                    <app-icon [name]="c.cierres >= c.cierresMesAnterior ? 'up' : 'down'" />
                    {{ c.cierres >= c.cierresMesAnterior ? '+' : '' }}{{ num(c.cierres - c.cierresMesAnterior) }}
                  </span> vs. mes anterior ({{ num(c.cierresMesAnterior) }})
                </span>
              }
            </div>
            <div class="list">
              <div class="li"><span>Conversión</span><b>{{ pc(c.conversion) }}</b></div>
              <div class="li"><span>Monto cerrado</span><b>{{ money(c.monto) }}</b></div>
              <div class="li"><span>Venta promedio</span><b>{{ money(c.ticketPromedio) }}</b></div>
              <div class="li"><span>Ventas pendientes</span><b>{{ num(c.pendientes) }}</b></div>
            </div>
            <div>
              <h3 class="sec-t" style="margin-bottom:8px">Cierres por modalidad</h3>
              <div class="hbs">
                @for (m of modalidades(c); track m.n) {
                  <div class="hb">
                    <span class="hb-l">{{ m.n }}</span>
                    <span class="hb-t"><i [style.width.%]="m.w" [style.background]="color(c.campana)"></i></span>
                    <span class="hb-v">{{ m.v }}</span>
                  </div>
                }
              </div>
            </div>
          </section>
        }
      </div>

      <app-chart-panel titulo="Comparativo de campañas" subtitulo="Ordenado por cierres del mes">
        <app-data-table [columnas]="['Campaña', 'Gestiones', 'Cierres', 'Mes anterior', 'Conversión', 'Pendientes', 'Monto cerrado', 'Venta promedio']"
                        [derecha]="['Gestiones', 'Cierres', 'Mes anterior', 'Conversión', 'Pendientes', 'Monto cerrado', 'Venta promedio']">
          @for (c of lista(); track c.id) {
            <tr>
              <td><app-camp-chip [nombre]="c.campana" /></td>
              <td class="r">{{ num(c.gestiones) }}</td>
              <td class="r"><b>{{ num(c.cierres) }}</b></td>
              <td class="r">{{ num(c.cierresMesAnterior) }}</td>
              <td class="r">{{ pc(c.conversion) }}</td>
              <td class="r">{{ num(c.pendientes) }}</td>
              <td class="r mono">{{ money(c.monto) }}</td>
              <td class="r mono">{{ money(c.ticketPromedio) }}</td>
            </tr>
          }
        </app-data-table>
      </app-chart-panel>
    }
  `
})
export class CampanasComponent implements OnInit {
  private api = inject(ComercialService);
  num = num; pc = pc; money = money; color = colorCampana;
  meses = periodos();
  periodo = signal(periodoActual());
  lista = signal<KpiCampana[]>([]);
  cargando = signal(true);
  error = signal('');

  private maxModalidad = computed(() => Math.max(1, ...this.lista().flatMap(c => Object.values(c.cierresPorModalidad))));

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.api.reporteCampanas(this.periodo()).subscribe({
      next: l => { this.lista.set(l); this.cargando.set(false); },
      error: e => { this.error.set(mensajeError(e, 'No se pudo cargar el reporte.')); this.cargando.set(false); }
    });
  }

  modalidades(c: KpiCampana) {
    const max = this.maxModalidad();
    return Object.entries(c.cierresPorModalidad).map(([n, v]) => ({ n, v, w: v / max * 100 }));
  }
}
