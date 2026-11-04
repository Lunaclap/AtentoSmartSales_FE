import { Component, HostListener, Injector, OnInit, afterNextRender, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComercialService, esGerente, mensajeError } from '../../../core/services/comercial.service';
import { Cliente, GestionRegistrada, NuevaGestion } from '../../../core/models/comercial.model';
import { IconComponent } from '../icon/icon';
import { money } from '../../utils/formato';

type Campo = 'numeroDocumento' | 'nombres' | 'apellidos' | 'correo' | 'telefono' | 'campanaId' | 'modalidadId'
  | 'resultado' | 'monto' | 'asesorId' | 'fechaSeguimiento';

/** Mismo límite que Cliente.MAX_TELEFONOS en el backend. */
const MAX_TELEFONOS = 5;
/** Valor de la opción del combo para escribir un número que aún no está registrado. */
const OTRO_NUMERO = 'otro';

const DESCRIPCION: Record<string, string> = {
  'Exitosa': 'Genera la venta en estado Pendiente',
  'Agendada': 'El cliente queda Contactado con seguimiento',
  'Rechazado': 'El cliente no acepta la oferta',
  'Black List': 'No volver a llamar',
  'No contactado': 'No se logró hablar con el cliente'
};

/**
 * Formulario "Nueva venta" (REQ-22): datos del cliente, campaña, modalidad, tipificación,
 * monto final y comentarios. Registra una gestión; si es Exitosa, el backend crea la venta.
 */
@Component({
  selector: 'app-gestion-form',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="ov mid" (click)="cancelar.emit()">
      <form class="modal wide" role="dialog" aria-modal="true" aria-labelledby="g-t" novalidate
            (click)="$event.stopPropagation()" (ngSubmit)="guardar()">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
          <div>
            <h2 id="g-t">Nueva venta</h2>
            <p class="sub">Registra el resultado de la llamada. Los campos con * son obligatorios.</p>
          </div>
          <button type="button" class="close" (click)="cancelar.emit()" aria-label="Cerrar"><app-icon name="x" /></button>
        </div>

        @if (!cat()) {
          <div class="empty"><div class="spin" role="status"></div>Cargando catálogos…</div>
        } @else {
          <h3 class="sec-t">1. Datos del cliente</h3>
          <div class="three">
            <div class="field">
              <label for="g-td">Tipo de documento *</label>
              <select id="g-td" class="sel" name="td" [(ngModel)]="g.tipoDocumento" [disabled]="!!cliente()">
                <option value="DNI">DNI</option>
                <option value="CE">Carné de extranjería</option>
              </select>
            </div>
            <div class="field">
              <label for="g-doc">Número de documento *</label>
              <input id="g-doc" class="inp" inputmode="numeric" name="doc" [(ngModel)]="g.numeroDocumento" [disabled]="!!cliente()"
                     (blur)="buscarCliente()" [attr.aria-invalid]="err().numeroDocumento ? true : null" />
              <span class="err">{{ err().numeroDocumento }}</span>
              @if (avisoDoc()) { <span class="hint">{{ avisoDoc() }}</span> }
            </div>
            <div class="field">
              <label for="g-tel">Teléfono *</label>
              @if (telefonos().length > 1 && !otroNumero()) {
                <select id="g-tel" class="sel" name="tel" [ngModel]="g.telefono" (ngModelChange)="elegirTelefono($event)"
                        [attr.aria-invalid]="err().telefono ? true : null">
                  @for (t of telefonos(); track t) { <option [value]="t">{{ t }}</option> }
                  @if (telefonos().length < maxTelefonos) { <option [value]="otro">Otro número…</option> }
                </select>
              } @else {
                <input id="g-tel" class="inp" inputmode="numeric" maxlength="9" name="tel" [(ngModel)]="g.telefono" placeholder="9 dígitos"
                       [attr.aria-invalid]="err().telefono ? true : null" />
                @if (otroNumero()) {
                  <button type="button" class="btn sm" style="justify-self:start" (click)="usarRegistrado()">Usar un número registrado</button>
                }
              }
              <span class="err">{{ err().telefono }}</span>
            </div>
          </div>
          <div class="three">
            <div class="field">
              <label for="g-nom">Nombres *</label>
              <input id="g-nom" class="inp" name="nom" autocomplete="off" [(ngModel)]="g.nombres" [disabled]="registrado()" [attr.aria-invalid]="err().nombres ? true : null" />
              <span class="err">{{ err().nombres }}</span>
            </div>
            <div class="field">
              <label for="g-ape">Apellidos *</label>
              <input id="g-ape" class="inp" name="ape" autocomplete="off" [(ngModel)]="g.apellidos" [disabled]="registrado()" [attr.aria-invalid]="err().apellidos ? true : null" />
              <span class="err">{{ err().apellidos }}</span>
            </div>
            <div class="field">
              <label for="g-mail">Correo *</label>
              <input id="g-mail" class="inp" type="email" name="mail" autocomplete="off" [(ngModel)]="g.correo" [attr.aria-invalid]="err().correo ? true : null" />
              <span class="err">{{ err().correo }}</span>
            </div>
          </div>

          <h3 class="sec-t">2. Oferta</h3>
          <div class="three">
            <div class="field">
              <label for="g-camp">Campaña *</label>
              <select id="g-camp" class="sel" name="camp" [(ngModel)]="g.campanaId" [attr.aria-invalid]="err().campanaId ? true : null">
                <option [ngValue]="null" disabled>Elige una campaña</option>
                @for (c of cat()!.campanas; track c.id) { <option [ngValue]="c.id">{{ c.nombre }}</option> }
              </select>
              <span class="err">{{ err().campanaId }}</span>
            </div>
            <div class="field">
              <label for="g-mod">Modalidad *</label>
              <select id="g-mod" class="sel" name="mod" [(ngModel)]="g.modalidadId" [attr.aria-invalid]="err().modalidadId ? true : null">
                <option [ngValue]="null" disabled>Elige una modalidad</option>
                @for (m of cat()!.modalidades; track m.id) { <option [ngValue]="m.id">{{ m.nombre }}</option> }
              </select>
              <span class="err">{{ err().modalidadId }}</span>
            </div>
            <div class="field">
              <label for="g-as">Asesor *</label>
              <select id="g-as" class="sel" name="as" [(ngModel)]="g.asesorId" [disabled]="!gerente" [attr.aria-invalid]="err().asesorId ? true : null">
                <option [ngValue]="null" disabled>Elige un asesor</option>
                @for (a of cat()!.asesores; track a.id) { <option [ngValue]="a.id">{{ a.nombre }}</option> }
              </select>
              <span class="err">{{ err().asesorId }}</span>
            </div>
          </div>

          <h3 class="sec-t">3. Resultado de la llamada</h3>
          <fieldset class="field">
            <legend>Tipificación *</legend>
            <div class="rchips">
              @for (r of cat()!.resultados; track r) {
                <label class="rchip" [title]="desc[r] || ''">
                  <input type="radio" name="res" [value]="r" [ngModel]="resultado()" (ngModelChange)="resultado.set($event)" />
                  <span>{{ r === 'Exitosa' ? 'Venta exitosa' : r }}</span>
                </label>
              }
            </div>
            <span class="err">{{ err().resultado }}</span>
            @if (resultado() && desc[resultado()]) { <span class="hint">{{ desc[resultado()] }}</span> }
          </fieldset>

          <div class="two">
            <div class="field">
              <label for="g-monto">Monto final {{ resultado() === 'Exitosa' ? '*' : '' }}</label>
              <select id="g-monto" class="sel" name="monto" [(ngModel)]="g.monto" [attr.aria-invalid]="err().monto ? true : null">
                <option [ngValue]="null">{{ resultado() === 'Exitosa' ? 'Elige el monto' : 'Sin monto' }}</option>
                @for (m of cat()!.montos; track m) { <option [ngValue]="m">{{ money(m) }}</option> }
              </select>
              <span class="err">{{ err().monto }}</span>
            </div>
            @if (resultado() === 'Agendada') {
              <div class="field">
                <label for="g-seg">Fecha de seguimiento</label>
                <input id="g-seg" class="inp" type="datetime-local" name="seg" [(ngModel)]="g.fechaSeguimiento"
                       [attr.aria-invalid]="err().fechaSeguimiento ? true : null" />
                <span class="err">{{ err().fechaSeguimiento }}</span>
              </div>
            }
          </div>

          <div class="field">
            <label for="g-com">Comentarios</label>
            <textarea id="g-com" name="com" maxlength="500" [(ngModel)]="g.comentario" placeholder="Qué acordaron con el cliente"></textarea>
          </div>

          @if (errorApi()) { <p class="err" role="alert" style="margin:0">{{ errorApi() }}</p> }

          <div class="row-actions">
            <button type="button" class="btn" (click)="cancelar.emit()">Cancelar</button>
            <button type="submit" class="btn pri" [disabled]="guardando()">{{ guardando() ? 'Guardando…' : 'Guardar' }}</button>
          </div>
        }
      </form>
    </div>
  `
})
export class GestionFormComponent implements OnInit {
  /** Cliente existente (desde la ficha); si es nulo, se busca por documento o se registra uno nuevo. */
  cliente = input<Cliente | null>(null);
  guardado = output<GestionRegistrada>();
  cancelar = output<void>();

  private api = inject(ComercialService);
  private injector = inject(Injector);
  cat = this.api.catalogo;
  gerente = esGerente();
  desc = DESCRIPCION;
  money = money;
  maxTelefonos = MAX_TELEFONOS;
  otro = OTRO_NUMERO;

  g: NuevaGestion = {
    tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidos: '', correo: '', telefono: '',
    campanaId: null, modalidadId: null, resultado: '', monto: null, asesorId: null, comentario: '', fechaSeguimiento: null
  };
  resultado = signal('');
  err = signal<Partial<Record<Campo, string>>>({});
  errorApi = signal('');
  avisoDoc = signal('');
  guardando = signal(false);
  /** El cliente ya existe: sus nombres y apellidos no se editan. */
  registrado = signal(false);
  /** Números registrados del cliente; con más de uno, el teléfono es un combo. */
  telefonos = signal<string[]>([]);
  /** El asesor eligió "Otro número…": se muestra el campo de texto en lugar del combo. */
  otroNumero = signal(false);
  private telefonoPrevio = '';
  private docBuscado = '';

  ngOnInit() {
    const c = this.cliente();
    if (c) this.llenar(c);
    this.api.cargarCatalogos().subscribe({
      next: cat => {
        if (!this.gerente) this.g.asesorId = cat.asesores[0]?.id ?? null;
        else if (c?.asesorId) this.g.asesorId = c.asesorId;
        if (c?.campana) this.g.campanaId = cat.campanas.find(x => x.nombre === c.campana)?.id ?? null;
      },
      error: e => this.errorApi.set(mensajeError(e, 'No se pudieron cargar los catálogos.'))
    });
  }

  private llenar(c: Cliente) {
    Object.assign(this.g, {
      tipoDocumento: c.tipoDocumento, numeroDocumento: c.numeroDocumento, nombres: c.nombres, apellidos: c.apellidos,
      correo: c.correo ?? '', telefono: c.telefono ?? ''
    });
    this.registrado.set(true);
    this.telefonos.set(c.telefonos);
    this.otroNumero.set(false);
  }

  elegirTelefono(valor: string) {
    if (valor !== OTRO_NUMERO) { this.g.telefono = valor; return; }
    this.telefonoPrevio = this.g.telefono;
    this.g.telefono = '';
    this.otroNumero.set(true);
    afterNextRender(() => document.getElementById('g-tel')?.focus(), { injector: this.injector });
  }

  usarRegistrado() {
    this.g.telefono = this.telefonoPrevio;
    this.otroNumero.set(false);
    afterNextRender(() => document.getElementById('g-tel')?.focus(), { injector: this.injector });
  }

  /** Quita lo autocompletado cuando el documento cambia a otro cliente. */
  private vaciarCliente() {
    if (!this.registrado()) return;
    Object.assign(this.g, { nombres: '', apellidos: '', correo: '', telefono: '' });
    this.registrado.set(false);
    this.telefonos.set([]);
    this.otroNumero.set(false);
  }

  /** Si el documento ya existe, completa los datos del cliente. */
  buscarCliente() {
    if (this.cliente()) return;
    const doc = this.g.numeroDocumento.trim();
    if (doc === this.docBuscado) return;
    this.docBuscado = doc;
    this.avisoDoc.set('');
    this.vaciarCliente();
    if (!/^\d{8,12}$/.test(doc)) return;
    this.api.clientePorDocumento(doc).subscribe({
      next: c => {
        this.llenar(c);
        const cat = this.cat();
        if (cat && c.campana && !this.g.campanaId) this.g.campanaId = cat.campanas.find(x => x.nombre === c.campana)?.id ?? null;
        this.avisoDoc.set('Cliente registrado: se completaron sus datos.');
      },
      error: e => this.avisoDoc.set(e?.status === 404 ? 'Cliente nuevo.' : mensajeError(e))
    });
  }

  guardar() {
    const g = this.g, r = this.resultado();
    const e: Partial<Record<Campo, string>> = {};
    const doc = g.numeroDocumento.trim();
    if (g.tipoDocumento === 'DNI' && !/^\d{8}$/.test(doc)) e.numeroDocumento = 'El DNI debe tener 8 dígitos.';
    if (g.tipoDocumento === 'CE' && !/^\d{9,12}$/.test(doc)) e.numeroDocumento = 'El carné debe tener entre 9 y 12 dígitos.';
    if (!g.nombres.trim()) e.nombres = 'Escribe los nombres.';
    if (!g.apellidos.trim()) e.apellidos = 'Escribe los apellidos.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.correo.trim())) e.correo = 'Escribe un correo válido.';
    if (!/^9\d{8}$/.test(g.telefono.trim())) e.telefono = 'Debe tener 9 dígitos y empezar con 9.';
    if (!g.campanaId) e.campanaId = 'Elige la campaña.';
    if (!g.modalidadId) e.modalidadId = 'Elige la modalidad.';
    if (!g.asesorId) e.asesorId = 'Elige el asesor.';
    if (!r) e.resultado = 'Elige la tipificación de la llamada.';
    if (r === 'Exitosa' && !g.monto) e.monto = 'Elige el monto final de la venta.';
    if (r === 'Agendada' && g.fechaSeguimiento && new Date(g.fechaSeguimiento) < new Date()) e.fechaSeguimiento = 'Elige una fecha futura.';
    this.err.set(e);
    this.errorApi.set('');
    if (Object.keys(e).length) return;

    this.guardando.set(true);
    this.api.registrarGestion({
      ...g, resultado: r, numeroDocumento: doc,
      fechaSeguimiento: r === 'Agendada' ? g.fechaSeguimiento || null : null
    }).subscribe({
      next: res => { this.guardando.set(false); this.guardado.emit(res); },
      error: err => { this.guardando.set(false); this.errorApi.set(mensajeError(err, 'No se pudo registrar la gestión.')); }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.cancelar.emit(); }
}
