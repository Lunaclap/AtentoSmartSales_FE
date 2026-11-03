import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService, FILTRO_INICIAL, Filtro } from '../../../core/services/demo-data.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters">
      <div class="seg" role="group" aria-label="Periodo">
        @for (d of [7, 30, 90]; track d) {
          <button type="button" [attr.aria-pressed]="dias === d" (click)="cambiarDias(d)">{{ d }} días</button>
        }
      </div>

      <label class="sr" for="f-camp">Campaña</label>
      <select id="f-camp" class="sel" [(ngModel)]="campana" (ngModelChange)="onFilterChange()">
        <option value="todas">Todas las campañas</option>
        @for (c of data.campanas; track c.id) { <option [value]="c.id">{{ c.n }}</option> }
      </select>

      <label class="sr" for="f-eq">Equipo</label>
      <select id="f-eq" class="sel" [(ngModel)]="equipo" (ngModelChange)="onFilterChange()">
        <option value="todos">Todos los equipos</option>
        @for (e of data.equipos; track e) { <option [value]="e">{{ e }}</option> }
      </select>

      @if (dias !== inicial.dias || campana !== inicial.campana || equipo !== inicial.equipo) {
        <button type="button" class="link" (click)="restablecer()">Restablecer filtros</button>
      }
    </div>
  `
})
export class FilterBarComponent {
  data = inject(DemoDataService);
  inicial = FILTRO_INICIAL;

  dias: number = FILTRO_INICIAL.dias;
  campana: string = FILTRO_INICIAL.campana;
  equipo: string = FILTRO_INICIAL.equipo;

  @Output() filterChange = new EventEmitter<Filtro>();

  cambiarDias(d: number) {
    this.dias = d;
    this.onFilterChange();
  }

  restablecer() {
    this.dias = FILTRO_INICIAL.dias;
    this.campana = FILTRO_INICIAL.campana;
    this.equipo = FILTRO_INICIAL.equipo;
    this.onFilterChange();
  }

  onFilterChange() {
    this.filterChange.emit({ dias: this.dias, campana: this.campana, equipo: this.equipo });
  }
}
