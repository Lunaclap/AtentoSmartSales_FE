import { Component, computed, input } from '@angular/core';

// Tamaño, viewBox y grosor de trazo por icono; el resto usa el estándar de 18 px.
const CFG: Record<string, { s: number; vb: string; sw: number }> = {
  check: { s: 13, vb: '0 0 24 24', sw: 3 },
  x: { s: 13, vb: '0 0 24 24', sw: 3 },
  alert: { s: 13, vb: '0 0 24 24', sw: 2.6 },
  dot: { s: 9, vb: '0 0 10 10', sw: 0 },
  ring: { s: 9, vb: '0 0 10 10', sw: 1.6 },
  up: { s: 10, vb: '0 0 10 10', sw: 0 },
  down: { s: 10, vb: '0 0 10 10', sw: 0 },
  brand: { s: 20, vb: '0 0 24 24', sw: 2.4 }
};

@Component({
  selector: 'app-icon',
  standalone: true,
  styles: [':host{display:inline-flex;flex:none}'],
  template: `
    <svg [attr.width]="cfg().s" [attr.height]="cfg().s" [attr.viewBox]="cfg().vb" fill="none" stroke="currentColor"
         [attr.stroke-width]="cfg().sw" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (name()) {
        @case ('dash') { <svg:rect x="3" y="3" width="7" height="9"/><svg:rect x="14" y="3" width="7" height="5"/><svg:rect x="14" y="12" width="7" height="9"/><svg:rect x="3" y="16" width="7" height="5"/> }
        @case ('team') { <svg:circle cx="9" cy="8" r="3.5"/><svg:path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><svg:circle cx="17.5" cy="9" r="2.5"/><svg:path d="M17.5 14c2.6 0 4.5 1.8 4.5 4.5"/> }
        @case ('report') { <svg:path d="M6 3h9l4 4v14H6z"/><svg:path d="M14 3v5h5"/><svg:path d="M9 13h7M9 17h7"/> }
        @case ('user') { <svg:circle cx="12" cy="8" r="4"/><svg:path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/> }
        @case ('target') { <svg:circle cx="12" cy="12" r="9"/><svg:circle cx="12" cy="12" r="5"/><svg:circle cx="12" cy="12" r="1.5"/> }
        @case ('plus') { <svg:circle cx="12" cy="12" r="9"/><svg:path d="M12 8v8M8 12h8"/> }
        @case ('cart') { <svg:circle cx="9" cy="20" r="1.5"/><svg:circle cx="18" cy="20" r="1.5"/><svg:path d="M2 3h3l2.4 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/> }
        @case ('key') { <svg:circle cx="8" cy="15" r="4"/><svg:path d="M11 12l9-9M17 6l3 3M14 9l2 2"/> }
        @case ('cal') { <svg:rect x="3" y="5" width="18" height="16" rx="2"/><svg:path d="M3 10h18M8 3v4M16 3v4"/> }
        @case ('out') { <svg:path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><svg:path d="M16 17l5-5-5-5M21 12H9"/> }
        @case ('search') { <svg:circle cx="11" cy="11" r="7"/><svg:path d="M20 20l-4-4"/> }
        @case ('brand') { <svg:path d="M5 19V11M12 19V5M19 19v-6"/> }
        @case ('check') { <svg:path d="M5 12l5 5L20 7"/> }
        @case ('x') { <svg:path d="M6 6l12 12M18 6L6 18"/> }
        @case ('alert') { <svg:path d="M12 3l10 18H2z"/><svg:path d="M12 10v5M12 18.5v.1"/> }
        @case ('dot') { <svg:circle cx="5" cy="5" r="4" fill="currentColor" stroke="none"/> }
        @case ('ring') { <svg:circle cx="5" cy="5" r="3.3"/> }
        @case ('up') { <svg:path d="M5 1l4 7H1z" fill="currentColor" stroke="none"/> }
        @case ('down') { <svg:path d="M5 9L1 2h8z" fill="currentColor" stroke="none"/> }
      }
    </svg>
  `
})
export class IconComponent {
  name = input.required<string>();
  cfg = computed(() => CFG[this.name()] ?? { s: 18, vb: '0 0 24 24', sw: 1.8 });
}
