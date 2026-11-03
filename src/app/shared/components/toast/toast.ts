import { Component, Injectable, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly msg = signal<{ texto: string; error: boolean } | null>(null);
  private t?: ReturnType<typeof setTimeout>;

  show(texto: string, error = false) {
    this.msg.set({ texto, error });
    clearTimeout(this.t);
    this.t = setTimeout(() => this.msg.set(null), 3400);
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (toast.msg(); as m) {
      <div class="toast" [class.crit]="m.error" role="status" aria-live="polite">
        <app-icon [name]="m.error ? 'x' : 'check'" /><span>{{ m.texto }}</span>
      </div>
    }
  `
})
export class ToastComponent {
  toast = inject(ToastService);
}
