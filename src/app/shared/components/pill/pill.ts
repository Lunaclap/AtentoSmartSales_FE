import { Component, inject, input } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { Pill } from '../../utils/formato';
import { DemoDataService } from '../../../core/services/demo-data.service';

/** Etiqueta de estado con icono (En meta, Cerrado, Venta...). */
@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [IconComponent],
  template: `<span class="pill {{ p().cls }}"><app-icon [name]="p().icon" />{{ p().label }}</span>`
})
export class PillComponent {
  p = input.required<Pill>();
}

/** Punto de color con el nombre de la campaña. */
@Component({
  selector: 'app-camp-chip',
  standalone: true,
  template: `<span class="camp"><i [style.background]="data.campana(id()).col"></i>{{ data.campana(id()).n }}</span>`
})
export class CampChipComponent {
  id = input.required<string>();
  data = inject(DemoDataService);
}
