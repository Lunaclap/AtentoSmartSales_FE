import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-black border-secondary text-light p-4 mb-4">
      <div class="table-responsive">
        <table class="table table-dark table-hover align-middle mb-0 border-secondary">
          <thead>
            <tr class="text-muted small">
              <th *ngFor="let col of columnas">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <ng-content></ng-content>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DataTableComponent {
  @Input() columnas: string[] = [];
}