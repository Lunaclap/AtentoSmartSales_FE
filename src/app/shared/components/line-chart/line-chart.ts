import { Component, computed, input, signal } from '@angular/core';
import { num } from '../../utils/formato';
import { mostrarTip, ocultarTip } from '../tooltip/tooltip';

export interface PuntoSerie {
  etiqueta: string; // texto del eje X, p. ej. "20 oct"
  titulo: string;   // encabezado del tooltip, p. ej. "lunes 20 oct"
  v: number;        // valor real
  m: number;        // meta del día
}

const W = 720, H = 250, L = 42, R = 12, T = 12, B = 28;

function pasoRedondo(x: number) {
  const p = Math.pow(10, Math.floor(Math.log10(x))), f = x / p;
  for (const q of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (f <= q) return q * p;
  return 10 * p;
}

/** Línea de valores diarios con área, línea de meta punteada y cursor con tooltip. */
@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <svg class="lc" [attr.viewBox]="'0 0 ' + W + ' ' + H" role="img" [attr.aria-label]="nombre() + ' por día frente a la meta diaria'">
      @for (t of g().ticks; track $index) {
        <svg:line [attr.x1]="L" [attr.x2]="W - R" [attr.y1]="t.y" [attr.y2]="t.y" [attr.stroke]="$first ? 'var(--axis)' : 'var(--grid)'" />
        <svg:text [attr.x]="L - 8" [attr.y]="t.y + 4" text-anchor="end">{{ t.label }}</svg:text>
      }
      @for (x of g().xl; track $index) {
        <svg:text [attr.x]="x.x" [attr.y]="H - 8" text-anchor="middle">{{ x.label }}</svg:text>
      }
      <svg:path [attr.d]="g().area" fill="var(--c1)" opacity=".12" />
      <svg:path [attr.d]="g().meta" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="5 4" />
      <svg:path [attr.d]="g().line" fill="none" stroke="var(--c1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      @if (g().last; as p) {
        <svg:circle [attr.cx]="p.x" [attr.cy]="p.y" r="4.5" fill="var(--c1)" stroke="var(--surface)" stroke-width="2" />
      }
      @if (hover(); as h) {
        <svg:line [attr.x1]="h.x" [attr.x2]="h.x" [attr.y1]="T" [attr.y2]="H - B" stroke="var(--ink-2)" stroke-width="1" />
        <svg:circle [attr.cx]="h.x" [attr.cy]="h.y" r="5" fill="var(--c1)" stroke="var(--surface)" stroke-width="2" />
      }
      <svg:rect [attr.x]="L" [attr.y]="T" [attr.width]="W - L - R" [attr.height]="H - T - B" fill="transparent"
                (mousemove)="mover($event)" (mouseleave)="salir()" />
    </svg>
  `
})
export class LineChartComponent {
  puntos = input.required<PuntoSerie[]>();
  nombre = input('Ventas');

  readonly W = W; readonly H = H; readonly L = L; readonly R = R; readonly T = T; readonly B = B;
  hover = signal<{ x: number; y: number } | null>(null);

  g = computed(() => {
    const pts = this.puntos(), n = pts.length;
    const mx = Math.max(1, ...pts.map(p => Math.max(p.v, p.m)));
    const step = pasoRedondo(mx * 1.08 / 4), max = step * 4;
    const X = (i: number) => n < 2 ? L : L + i * (W - L - R) / (n - 1);
    const Y = (v: number) => T + (H - T - B) * (1 - v / max);

    const ticks = [0, 1, 2, 3, 4].map(k => ({ y: Y(k * step), label: num(k * step) }));
    const every = Math.max(1, Math.ceil(n / 7));
    const xl: { x: number; label: string }[] = [];
    pts.forEach((p, i) => {
      if (i % every !== 0 && i !== n - 1) return;
      // La última etiqueta se omite si queda pegada a la anterior.
      if (i === n - 1 && i % every !== 0 && i - Math.floor(i / every) * every < every * 0.6) return;
      xl.push({ x: X(i), label: p.etiqueta });
    });

    const line = pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join('');
    const area = n ? line + 'L' + X(n - 1).toFixed(1) + ' ' + Y(0) + 'L' + X(0).toFixed(1) + ' ' + Y(0) + 'Z' : '';
    const meta = pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.m).toFixed(1)).join('');
    const last = n ? { x: X(n - 1), y: Y(pts[n - 1].v) } : null;
    return { ticks, xl, line, area, meta, last, X, Y };
  });

  mover(e: MouseEvent) {
    const pts = this.puntos(), n = pts.length;
    if (!n) return;
    const svg = (e.target as SVGElement).ownerSVGElement!;
    const rc = svg.getBoundingClientRect();
    const xv = (e.clientX - rc.left) * W / rc.width;
    const i = Math.max(0, Math.min(n - 1, Math.round((xv - L) / ((W - L - R) / Math.max(n - 1, 1)))));
    const p = pts[i], g = this.g();
    this.hover.set({ x: g.X(i), y: g.Y(p.v) });
    mostrarTip(`<b>${p.titulo}</b><br>${this.nombre()}: ${p.v}<br>Meta diaria: ${p.m.toFixed(1).replace('.', ',')}`, e.clientX, e.clientY);
  }

  salir() {
    this.hover.set(null);
    ocultarTip();
  }
}

/** Mini línea de tendencia para las tarjetas KPI. */
@Component({
  selector: 'app-spark',
  standalone: true,
  template: `
    @if (s(); as s) {
      <svg width="110" height="30" viewBox="0 0 110 30" aria-hidden="true">
        <svg:path [attr.d]="s.d" fill="none" [attr.stroke]="color()" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
        <svg:circle [attr.cx]="s.x" [attr.cy]="s.y" r="3" [attr.fill]="color()" />
      </svg>
    }
  `
})
export class SparkComponent {
  valores = input.required<number[]>();
  color = input('var(--c1)');

  s = computed(() => {
    const v = this.valores(), n = v.length;
    if (n < 2) return null;
    let mx = Math.max(...v);
    const mn = Math.min(...v);
    if (mx === mn) mx += 1;
    const pts = v.map((x, i) => [i * 104 / (n - 1) + 3, 26 - (x - mn) / (mx - mn) * 22]);
    return {
      d: pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''),
      x: pts[n - 1][0], y: pts[n - 1][1]
    };
  });
}
