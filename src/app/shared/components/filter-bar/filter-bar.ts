import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
      <!-- Selector de días con cambio dinámico de estilo -->
      <div class="btn-group bg-black p-1 rounded border border-secondary">
        <button 
          type="button"
          class="btn btn-sm border-0" 
          [ngClass]="dias === 7 ? 'btn-primary text-white' : 'text-muted bg-transparent'" 
          (click)="cambiarDias(7)">7 días</button>
        <button 
          type="button"
          class="btn btn-sm border-0" 
          [ngClass]="dias === 30 ? 'btn-primary text-white' : 'text-muted bg-transparent'" 
          (click)="cambiarDias(30)">30 días</button>
        <button 
          type="button"
          class="btn btn-sm border-0" 
          [ngClass]="dias === 90 ? 'btn-primary text-white' : 'text-muted bg-transparent'" 
          (click)="cambiarDias(90)">90 días</button>
      </div>

      <!-- Select de campañas -->
      <select class="form-select form-select-sm bg-black text-light border-secondary w-auto" [(ngModel)]="campana" (change)="onFilterChange()">
        <option value="todas">Todas las campañas</option>
        <option value="prestamos">Préstamos</option>
        <option value="telefonia">Telefonía móvil</option>
        <option value="seguros">Seguros de salud</option>
      </select>

      <!-- Select de equipos -->
      <select class="form-select form-select-sm bg-black text-light border-secondary w-auto" [(ngModel)]="equipo" (change)="onFilterChange()">
        <option value="todos">Todos los equipos</option>
        <option value="lima-este">Lima Este</option>
        <option value="lima-centro">Lima Centro</option>
        <option value="remoto">Remoto</option>
      </select>
    </div>
  `
})
export class FilterBarComponent {
  dias: number = 7;
  campana: string = 'todas';
  equipo: string = 'todos';

  @Output() filterChange = new EventEmitter<any>();

  cambiarDias(d: number) {
    this.dias = d;
    this.onFilterChange();
  }

  onFilterChange() {
    this.filterChange.emit({ dias: this.dias, campana: this.campana, equipo: this.equipo });
  }
}