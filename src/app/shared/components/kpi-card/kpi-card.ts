import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-black border-secondary text-light p-3 h-100">
      <span class="text-muted small">{{ titulo }}</span>
      <h2 class="fw-bold my-1 display-6">{{ valor }}</h2>
      <span [ngClass]="esPositivo ? 'text-success' : 'text-danger'" class="small">
        {{ esPositivo ? '▲' : '▼' }} {{ variacion }} <span class="text-muted">frente al periodo anterior</span>
      </span>
      <ng-content></ng-content>
    </div>
  `
})
export class KpiCardComponent {
  @Input() titulo: string = '';
  @Input() valor: string | number = '';
  @Input() variacion: string = '';
  @Input() esPositivo: boolean = true;
}