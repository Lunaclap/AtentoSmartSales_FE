import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Tarjeta con título, subtítulo y una zona opcional a la derecha (`[acciones]`: leyenda o botón). */
@Component({
  selector: 'app-chart-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <div class="card-h">
        <div>
          <h2>{{ titulo }}</h2>
          @if (subtitulo) { <p class="sub">{{ subtitulo }}</p> }
        </div>
        <ng-content select="[acciones]"></ng-content>
      </div>
      <ng-content></ng-content>
    </section>
  `
})
export class ChartPanelComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
}
