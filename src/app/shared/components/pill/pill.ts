import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { Pill, colorCampana } from '../../utils/formato';

/** Etiqueta de estado con icono (En meta, Aprobado, Cerrado...). */
@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [IconComponent],
  template: `<span class="pill {{ p().cls }}"><app-icon [name]="p().icon" />{{ p().label }}</span>`
})
export class PillComponent {
  p = input.required<Pill>();
}

/** Punto de color con el nombre de la campaña; "-" si el cliente aún no tiene campaña (REQ-07). */
@Component({
  selector: 'app-camp-chip',
  standalone: true,
  template: `
    @if (nombre(); as n) {
      <span class="camp"><i [style.background]="color(n)"></i>{{ n }}</span>
    } @else { - }
  `
})
export class CampChipComponent {
  nombre = input<string | null>(null);
  color = colorCampana;
}
