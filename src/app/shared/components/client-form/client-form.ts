import { Component, EventEmitter, HostListener, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService, NuevoCliente } from '../../../core/services/demo-data.service';
import { IconComponent } from '../icon/icon';

type Campo = 'nombre' | 'doc' | 'tel' | 'correo';

/** Modal de registro de un cliente nuevo. Emite los datos validados en `onSubmit`. */
@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="ov mid" (click)="cancelar()">
      <form class="modal" role="dialog" aria-modal="true" aria-labelledby="m-t" novalidate
            (click)="$event.stopPropagation()" (ngSubmit)="guardarCliente()">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div>
            <h2 id="m-t">Nuevo cliente</h2>
            <p class="sub">Registra los datos básicos para empezar a gestionarlo.</p>
          </div>
          <button type="button" class="close" (click)="cancelar()" aria-label="Cerrar"><app-icon name="x" /></button>
        </div>

        <div class="field">
          <label for="n-nom">Nombre o razón social *</label>
          <input id="n-nom" class="inp" autocomplete="off" [(ngModel)]="cliente.nombre" name="nombre" [attr.aria-invalid]="err().nombre ? true : null" />
          <span class="err">{{ err().nombre }}</span>
        </div>

        <div class="two">
          <div class="field">
            <label for="n-tipo">Tipo de cliente *</label>
            <select id="n-tipo" class="sel" [(ngModel)]="cliente.tipo" name="tipo">
              <option value="Persona">Persona</option>
              <option value="Empresa">Empresa</option>
            </select>
          </div>
          <div class="field">
            <label for="n-doc">Documento *</label>
            <input id="n-doc" class="inp" inputmode="numeric" maxlength="11" [(ngModel)]="cliente.doc" name="doc"
                   [placeholder]="cliente.tipo === 'Persona' ? 'DNI de 8 dígitos' : 'RUC de 11 dígitos'" [attr.aria-invalid]="err().doc ? true : null" />
            <span class="err">{{ err().doc }}</span>
          </div>
        </div>

        <div class="two">
          <div class="field">
            <label for="n-tel">Teléfono *</label>
            <input id="n-tel" class="inp" inputmode="numeric" maxlength="9" placeholder="9 dígitos" [(ngModel)]="cliente.tel" name="tel" [attr.aria-invalid]="err().tel ? true : null" />
            <span class="err">{{ err().tel }}</span>
          </div>
          <div class="field">
            <label for="n-mail">Correo</label>
            <input id="n-mail" class="inp" type="email" placeholder="nombre@correo.com" [(ngModel)]="cliente.correo" name="correo" [attr.aria-invalid]="err().correo ? true : null" />
            <span class="err">{{ err().correo }}</span>
          </div>
        </div>

        <div class="two">
          <div class="field">
            <label for="n-ori">Origen del contacto *</label>
            <select id="n-ori" class="sel" [(ngModel)]="cliente.origen" name="origen">
              @for (o of data.origenes; track o) { <option [value]="o">{{ o }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="n-as">Asesor asignado *</label>
            <select id="n-as" class="sel" [(ngModel)]="cliente.asesor" name="asesor">
              @for (a of data.asesores; track a.id) { <option [ngValue]="a.id">{{ a.n }}</option> }
            </select>
          </div>
        </div>

        <div class="row-actions">
          <button type="button" class="btn" (click)="cancelar()">Cancelar</button>
          <button type="submit" class="btn pri">Guardar cliente</button>
        </div>
      </form>
    </div>
  `
})
export class ClientFormComponent {
  data = inject(DemoDataService);

  cliente: NuevoCliente = {
    nombre: '',
    tipo: 'Persona',
    doc: '',
    tel: '',
    correo: '',
    origen: this.data.origenes[0],
    asesor: 0
  };

  err = signal<Partial<Record<Campo, string>>>({});

  @Output() onSubmit = new EventEmitter<NuevoCliente>();
  @Output() onCancel = new EventEmitter<void>();

  guardarCliente() {
    const c = this.cliente;
    const doc = c.doc.trim();
    const dup = this.data.buscarDocumento(doc);
    const reDoc = c.tipo === 'Persona' ? /^\d{8}$/ : /^\d{11}$/;
    const e: Partial<Record<Campo, string>> = {};
    if (c.nombre.trim().length < 3) e.nombre = 'Escribe el nombre o la razón social.';
    if (!reDoc.test(doc)) e.doc = c.tipo === 'Persona' ? 'El DNI debe tener 8 dígitos.' : 'El RUC debe tener 11 dígitos.';
    else if (dup) e.doc = 'Este documento ya está registrado a nombre de ' + dup.nombre + '.';
    if (!/^9\d{8}$/.test(c.tel.trim())) e.tel = 'El teléfono debe tener 9 dígitos y empezar con 9.';
    if (c.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo.trim())) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    this.err.set(e);
    if (Object.keys(e).length) return;
    this.onSubmit.emit({ ...c, nombre: c.nombre.trim(), doc, tel: c.tel.trim(), correo: c.correo.trim() });
  }

  @HostListener('document:keydown.escape')
  cancelar() {
    this.onCancel.emit();
  }
}
