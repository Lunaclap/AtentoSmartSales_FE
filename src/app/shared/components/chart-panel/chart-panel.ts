import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-black border-secondary text-light p-4 h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="fw-bold mb-0">{{ titulo }}</h5>
          <small class="text-muted">{{ subtitulo }}</small>
        </div>
      </div>
      <div class="bg-dark rounded p-3 position-relative" style="height: 220px;">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ChartPanelComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
}