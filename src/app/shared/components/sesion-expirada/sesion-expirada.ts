import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { SesionService } from '../../../core/services/sesion.service';
import { IconComponent } from '../icon/icon';

/** Aviso de sesión cerrada por inactividad. No se puede cerrar sin aceptar: la sesión ya terminó. */
@Component({
  selector: 'app-sesion-expirada',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="ov mid sesion-ov">
      <div class="modal sesion" role="alertdialog" aria-modal="true" aria-labelledby="se-t" aria-describedby="se-d">
        <span class="sesion-ic"><app-icon name="alert" /></span>
        <h2 id="se-t">Sesión cerrada</h2>
        <p id="se-d">Debido a mucho tiempo de inactividad se cerró la sesión. Vuelve a iniciar sesión para continuar.</p>
        <button #boton type="button" class="btn pri" (click)="sesion.aceptar()">Ir al inicio de sesión</button>
      </div>
    </div>
  `
})
export class SesionExpiradaComponent implements AfterViewInit {
  sesion = inject(SesionService);
  private boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');

  ngAfterViewInit() {
    this.boton().nativeElement.focus();
  }
}
