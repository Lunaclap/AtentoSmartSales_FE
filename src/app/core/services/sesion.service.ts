import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ComercialService } from './comercial.service';

/** Minutos sin actividad (mouse, teclado, toque o scroll) antes de cerrar la sesión. */
export const MINUTOS_INACTIVIDAD = 30;
const LIMITE_MS = MINUTOS_INACTIVIDAD * 60_000;
const CLAVE = 'ultimaActividad';
const EVENTOS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

/**
 * Cierra la sesión por inactividad o cuando el backend rechaza el token (401),
 * y muestra el aviso. El usuario vuelve al login al aceptar.
 * La última actividad se guarda en localStorage, así que cuenta entre pestañas
 * y también si el navegador estuvo cerrado.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private auth = inject(AuthService);
  private api = inject(ComercialService);
  private router = inject(Router);

  /** true mientras se muestra el aviso de sesión cerrada. */
  readonly expirada = signal(false);

  private intervalo?: ReturnType<typeof setInterval>;
  private ultimoGuardado = 0;
  private readonly registrar = () => {
    const ahora = Date.now();
    // Basta con guardar una vez cada 5 s: mousemove dispara cientos de eventos.
    if (ahora - this.ultimoGuardado < 5_000) return;
    this.ultimoGuardado = ahora;
    this.guardar(ahora);
  };
  private readonly revisar = () => {
    if (!this.auth.isLoggedIn() || this.expirada()) return;
    if (Date.now() - this.ultima() > LIMITE_MS) this.expirar();
  };

  /** Empieza a vigilar la actividad. Se llama al entrar al panel. */
  iniciar() {
    if (this.intervalo) return;
    // Si la última actividad registrada ya es muy antigua (p. ej. se volvió al día siguiente), cierra de inmediato.
    if (this.ultima() && Date.now() - this.ultima() > LIMITE_MS) {
      this.expirar();
    } else {
      this.guardar(Date.now());
    }
    EVENTOS.forEach(e => document.addEventListener(e, this.registrar, { passive: true }));
    document.addEventListener('visibilitychange', this.revisar);
    this.intervalo = setInterval(this.revisar, 30_000);
  }

  detener() {
    EVENTOS.forEach(e => document.removeEventListener(e, this.registrar));
    document.removeEventListener('visibilitychange', this.revisar);
    clearInterval(this.intervalo);
    this.intervalo = undefined;
  }

  /** Cierra la sesión y muestra el aviso. Lo usan el control de inactividad y el interceptor (401). */
  expirar() {
    if (this.expirada()) return;
    this.detener();
    this.auth.logout();
    this.api.limpiar();
    localStorage.removeItem(CLAVE);
    this.expirada.set(true);
  }

  /** Botón "Ir al inicio de sesión" del aviso. */
  aceptar() {
    this.expirada.set(false);
    this.router.navigate(['/login']);
  }

  /** Al iniciar sesión: la actividad cuenta desde ahora. */
  reiniciar() {
    this.guardar(Date.now());
  }

  private ultima() {
    return Number(localStorage.getItem(CLAVE)) || 0;
  }

  private guardar(t: number) {
    try { localStorage.setItem(CLAVE, String(t)); } catch { /* almacenamiento no disponible */ }
  }
}
