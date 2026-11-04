import { Component, HostListener, effect, inject, input, output, signal } from '@angular/core';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { Cliente, FichaCliente } from '../../../core/models/comercial.model';
import { IconComponent } from '../icon/icon';
import { CampChipComponent, PillComponent } from '../pill/pill';
import { fechaCorta, fechaHora, gestionPill, guion, money, num, relativa, tipificacionPill, ventaPill } from '../../utils/formato';

/** Ficha del cliente: datos, resumen, historial de gestiones y ventas (REQ-21). */
@Component({
  selector: 'app-client-drawer',
  standalone: true,
  imports: [IconComponent, PillComponent, CampChipComponent],
  template: `
    <div class="ov" (click)="cerrar.emit()">
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="d-t" (click)="$event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
          <div>
            <h2 id="d-t" style="font-size:22px">{{ f()?.cliente?.nombreCompleto ?? 'Ficha del cliente' }}</h2>
            @if (f(); as f) {
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                <app-pill [p]="gestionPill(f.cliente.estadoGestion)" />
                <app-pill [p]="tipificacionPill(f.cliente.tipificacion)" />
                <app-camp-chip [nombre]="f.cliente.campana" />
              </div>
            }
          </div>
          <button type="button" class="close" (click)="cerrar.emit()" aria-label="Cerrar ficha"><app-icon name="x" /></button>
        </div>

        @if (error()) { <p class="err" role="alert">{{ error() }}</p> }
        @if (!f() && !error()) { <div class="empty"><div class="spin" role="status"></div>Cargando ficha…</div> }

        @if (f(); as f) {
          <div class="ficha-res">
            <div><b>{{ num(f.resumen.gestiones) }}</b><span>Gestiones</span></div>
            <div><b>{{ num(f.resumen.ventasCerradas) }}</b><span>Ventas cerradas</span></div>
            <div><b>{{ num(f.resumen.ventasPendientes) }}</b><span>Pendientes</span></div>
            <div><b>{{ money(f.resumen.montoCerrado) }}</b><span>Monto cerrado</span></div>
          </div>

          <dl class="dl">
            <dt>Documento</dt><dd>{{ f.cliente.tipoDocumento }} {{ f.cliente.numeroDocumento }}</dd>
            <dt>{{ f.cliente.telefonos.length > 1 ? 'Teléfonos' : 'Teléfono' }}</dt><dd>{{ guion(f.cliente.telefonos.join(' · ')) }}</dd>
            <dt>Correo</dt><dd>{{ guion(f.cliente.correo) }}</dd>
            <dt>Asesor</dt><dd>{{ guion(f.cliente.asesor) }}</dd>
            <dt>Último contacto</dt><dd>{{ f.cliente.ultimoContacto ? fechaHora(f.cliente.ultimoContacto) + ' · ' + relativa(f.cliente.ultimoContacto) : '-' }}</dd>
            <dt>Seguimiento</dt><dd>{{ f.cliente.seguimiento ? fechaCorta(f.cliente.seguimiento) + ' · ' + relativa(f.cliente.seguimiento) : '-' }}</dd>
            <dt>Venc. de campaña</dt><dd>{{ guion(f.cliente.vencimientoCampana) }}</dd>
          </dl>

          @if (conVenta()) {
            <button type="button" class="btn pri" style="justify-self:start" (click)="nuevaVenta.emit(f.cliente)">
              <app-icon name="plus" />Nueva venta
            </button>
          }

          @if (f.ventas.length) {
            <div>
              <h3 style="font-size:16px;margin-bottom:6px">Ventas</h3>
              <div class="list">
                @for (v of f.ventas; track v.id) {
                  <div class="li">
                    <div>
                      <b>#{{ v.id }}</b> · {{ v.campana }} · {{ v.modalidad }}
                      <div class="hint">{{ fechaHora(v.fecha) }} · {{ money(v.monto) }}@if (v.telefono) { · Línea {{ v.telefono }} }</div>
                    </div>
                    @if (v.devuelta) { <span class="pill warn">Devuelta</span> } @else { <app-pill [p]="ventaPill(v.estado)" /> }
                  </div>
                }
              </div>
            </div>
          }

          <div>
            <h3 style="font-size:16px;margin-bottom:6px">Historial de gestiones</h3>
            <div class="list">
              @for (h of f.historial; track h.id) {
                <div class="li" style="align-items:flex-start">
                  <div>
                    <b>{{ fechaHora(h.fecha) }}</b> <app-pill [p]="tipificacionPill(h.tipificacion)" />
                    <div class="hint" style="margin-top:4px">
                      {{ h.estadoGestion }} · {{ h.asesor }}@if (h.telefono) { · {{ h.telefono }} }@if (h.campana) { · {{ h.campana }} }@if (h.modalidad) { · {{ h.modalidad }} }@if (h.monto) { · {{ money(h.monto) }} }
                    </div>
                    @if (h.comentario) { <div style="margin-top:4px">{{ h.comentario }}</div> }
                  </div>
                </div>
              } @empty {
                <p class="empty">Aún no hay gestiones registradas.</p>
              }
            </div>
          </div>
        }
      </aside>
    </div>
  `
})
export class ClientDrawerComponent {
  clienteId = input.required<number>();
  /** Muestra el botón "Nueva venta"; no aparece cuando la ficha se abre desde Clientes. */
  conVenta = input(true);
  cerrar = output<void>();
  nuevaVenta = output<Cliente>();

  private api = inject(ComercialService);
  f = signal<FichaCliente | null>(null);
  error = signal('');

  gestionPill = gestionPill; tipificacionPill = tipificacionPill; ventaPill = ventaPill;
  money = money; num = num; guion = guion; fechaHora = fechaHora; fechaCorta = fechaCorta; relativa = relativa;

  constructor() {
    effect(() => {
      const id = this.clienteId();
      this.error.set('');
      this.api.ficha(id).subscribe({
        next: f => this.f.set(f),
        error: e => this.error.set(mensajeError(e, 'No se pudo cargar la ficha.'))
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.cerrar.emit(); }
}
