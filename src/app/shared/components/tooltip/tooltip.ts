import { Directive, HostListener, OnDestroy, input } from '@angular/core';

let tip: HTMLDivElement | null = null;

/** Muestra un tooltip flotante en el cursor. Todas las instancias comparten un único elemento `.tip`. */
export function mostrarTip(html: string, x: number, y: number) {
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'tip';
    document.body.appendChild(tip);
  }
  tip.innerHTML = html;
  tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  const nx = Math.min(x + 14, window.innerWidth - w - 8);
  const ny = y + 16 + h > window.innerHeight ? y - h - 12 : y + 16;
  tip.style.left = Math.max(8, nx) + 'px';
  tip.style.top = Math.max(8, ny) + 'px';
}

export function ocultarTip() {
  if (tip) tip.hidden = true;
}

/** Uso: `<div [appTip]="'<b>Título</b><br>detalle'">`. El contenido lo arma la app, nunca el usuario. */
@Directive({ selector: '[appTip]', standalone: true })
export class TooltipDirective implements OnDestroy {
  appTip = input.required<string>();

  @HostListener('mouseenter', ['$event'])
  @HostListener('mousemove', ['$event'])
  mover(e: MouseEvent) { mostrarTip(this.appTip(), e.clientX, e.clientY); }

  @HostListener('mouseleave')
  ngOnDestroy() { ocultarTip(); }
}
