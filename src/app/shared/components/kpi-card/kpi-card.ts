import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon';
import { TooltipDirective } from '../tooltip/tooltip';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, IconComponent, TooltipDirective],
  template: `
    <article class="kpi">
      @if (tip) { <div class="kpi-l" [appTip]="tip">{{ titulo }}</div> } @else { <div class="kpi-l">{{ titulo }}</div> }
      <div class="kpi-v">{{ valor }}@if (unidad) {<small>{{ unidad }}</small>}</div>
      @if (variacion) {
        <span class="kpi-d">
          <span [ngClass]="esPositivo ? 'up' : 'down'"><app-icon [name]="baja ? 'down' : 'up'" /> {{ variacion }}</span>
          frente al periodo anterior
        </span>
      }
      <ng-content></ng-content>
    </article>
  `
})
export class KpiCardComponent {
  @Input() titulo: string = '';
  @Input() valor: string | number = '';
  @Input() unidad: string = '';
  @Input() variacion: string = '';
  /** Colorea la variación en verde (buena) o rojo (mala). */
  @Input() esPositivo: boolean = true;
  @Input() tip: string = '';

  get baja() { return /^[-−]/.test(this.variacion); }
}
