import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Tabla con cabecera; las filas se proyectan como `<tr>`. Las columnas listadas en `derecha` se alinean a la derecha. */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tw">
      <table>
        <thead>
          <tr>
            @for (col of columnas; track col) { <th [class.r]="derecha.includes(col)">{{ col }}</th> }
          </tr>
        </thead>
        <tbody>
          <ng-content></ng-content>
        </tbody>
        <ng-content select="tfoot"></ng-content>
      </table>
    </div>
  `
})
export class DataTableComponent {
  @Input() columnas: string[] = [];
  @Input() derecha: string[] = [];
}
