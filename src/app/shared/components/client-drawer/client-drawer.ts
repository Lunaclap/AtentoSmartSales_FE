import { Component, EventEmitter, HostListener, Output, inject, input } from '@angular/core';
import { Cliente, DemoDataService } from '../../../core/services/demo-data.service';
import { IconComponent } from '../icon/icon';
import { CampChipComponent, PillComponent } from '../pill/pill';
import { estadoPill, money, resultadoPill } from '../../utils/formato';

/** Ficha lateral del cliente con sus datos y el historial de gestiones. */
@Component({
  selector: 'app-client-drawer',
  standalone: true,
  imports: [IconComponent, PillComponent, CampChipComponent],
  template: `
    <div class="ov" (click)="cerrar.emit()">
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="d-t" (click)="$event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
          <div>
            <h2 id="d-t" style="font-size:22px">{{ c().nombre }}</h2>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
              <app-pill [p]="estadoPill(c().estado)" /><app-camp-chip [id]="c().camp" />
            </div>
          </div>
          <button type="button" class="close" (click)="cerrar.emit()" aria-label="Cerrar ficha"><app-icon name="x" /></button>
        </div>

        <dl class="dl">
          <dt>Tipo</dt><dd>{{ c().tipo }}</dd>
          <dt>Documento</dt><dd>{{ c().doc }}</dd>
          <dt>Teléfono</dt><dd>{{ c().tel }}</dd>
          <dt>Correo</dt><dd>{{ c().correo || '—' }}</dd>
          <dt>Origen</dt><dd>{{ c().origen }}</dd>
          <dt>Asesor</dt><dd>{{ data.asesor(c().asesor).n }}</dd>
          <dt>Último contacto</dt><dd>{{ c().ultimo == null ? 'Sin contacto' : data.rel(c().ultimo!) }}</dd>
          <dt>Próximo seguimiento</dt><dd>{{ c().prox == null ? '—' : data.rel(c().prox!) }}</dd>
        </dl>

        <div>
          <h3 style="font-size:16px;margin-bottom:6px">Historial de gestiones</h3>
          <div class="list">
            @for (h of c().hist; track $index) {
              <div class="li" style="align-items:flex-start">
                <div>
                  <b>{{ data.dm(h.d) }}</b> <app-pill [p]="resultadoPill(h.res)" />
                  <div class="hint" style="margin-top:4px">
                    @if (h.prod) { {{ h.prod }} · {{ money(h.val) }} · }{{ h.nota }}
                  </div>
                </div>
              </div>
            } @empty {
              <p class="empty">Aún no hay gestiones registradas.</p>
            }
          </div>
        </div>
      </aside>
    </div>
  `
})
export class ClientDrawerComponent {
  c = input.required<Cliente>({ alias: 'cliente' });
  @Output() cerrar = new EventEmitter<void>();

  data = inject(DemoDataService);
  estadoPill = estadoPill;
  resultadoPill = resultadoPill;
  money = money;

  @HostListener('document:keydown.escape')
  onEscape() { this.cerrar.emit(); }
}
