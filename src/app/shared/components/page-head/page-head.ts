import { Component, input } from '@angular/core';
import { fechaLarga } from '../../utils/formato';

/** Título de la vista con subtítulo; a la derecha muestra las acciones proyectadas o, si no hay, la fecha de hoy. */
@Component({
  selector: 'app-page-head',
  standalone: true,
  template: `
    <header class="head">
      <div>
        <h1>{{ titulo() }}</h1>
        @if (sub()) { <p class="sub">{{ sub() }}</p> }
      </div>
      <div class="row-actions">
        <ng-content />
        @if (fecha()) { <span class="chip-date">{{ hoy }}</span> }
      </div>
    </header>
  `
})
export class PageHeadComponent {
  titulo = input.required<string>();
  sub = input('');
  fecha = input(true);
  hoy = fechaLarga(new Date());
}
