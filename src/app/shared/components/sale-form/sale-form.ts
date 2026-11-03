import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService } from '../../../core/services/demo-data.service';
import { money, num } from '../../utils/formato';

export interface VentaNueva {
  tipoDoc: string;
  nroDoc: string;
  nombreCliente: string;
  campana: string;
  producto: string;
  monto: number | null;
  asesor: number;
  estado: string;
  telefono: string;
  observaciones: string;
}

type Campo = 'nroDoc' | 'nombreCliente' | 'monto' | 'telefono';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="g2">
      <form class="card" style="display:grid;gap:18px" novalidate (ngSubmit)="guardarVenta()">
        <div>
          <h2>Datos de la venta</h2>
          <p class="sub">Los campos con * son obligatorios.</p>
        </div>

        <h3 class="sec-t">1. Cliente</h3>
        <div class="three">
          <div class="field">
            <label for="v-td">Tipo de documento *</label>
            <select id="v-td" class="sel" [(ngModel)]="venta.tipoDoc" name="tipoDoc">
              <option value="DNI">DNI</option>
              <option value="RUC">RUC (empresa)</option>
              <option value="CE">Carné de extranjería</option>
            </select>
          </div>
          <div class="field">
            <label for="v-doc">Número de documento *</label>
            <input id="v-doc" class="inp" inputmode="numeric" [(ngModel)]="venta.nroDoc" name="nroDoc" placeholder="Ej. 48772910" [attr.aria-invalid]="err().nroDoc ? true : null" />
            <span class="err">{{ err().nroDoc }}</span>
          </div>
          <div class="field">
            <label for="v-tel">Teléfono</label>
            <input id="v-tel" class="inp" inputmode="numeric" maxlength="9" [(ngModel)]="venta.telefono" name="telefono" placeholder="9 dígitos" [attr.aria-invalid]="err().telefono ? true : null" />
            <span class="err">{{ err().telefono }}</span>
          </div>
        </div>
        <div class="field">
          <label for="v-nom">Nombre o razón social *</label>
          <input id="v-nom" class="inp" autocomplete="off" [(ngModel)]="venta.nombreCliente" name="nombreCliente" placeholder="Ej. Rosa Vera Torres" [attr.aria-invalid]="err().nombreCliente ? true : null" />
          <span class="err">{{ err().nombreCliente }}</span>
        </div>

        <h3 class="sec-t">2. Negociación</h3>
        <div class="two">
          <div class="field">
            <label for="v-camp">Campaña *</label>
            <select id="v-camp" class="sel" [(ngModel)]="venta.campana" name="campana" (ngModelChange)="cambiarCampana($event)">
              @for (c of data.campanas; track c.id) { <option [value]="c.id">{{ c.n }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="v-prod">Producto *</label>
            <select id="v-prod" class="sel" [(ngModel)]="venta.producto" name="producto">
              @for (p of productos(); track p) { <option [value]="p">{{ p }}</option> }
            </select>
          </div>
        </div>
        <div class="two">
          <div class="field">
            <label for="v-monto">Ingreso estimado (S/) *</label>
            <input id="v-monto" class="inp" type="number" min="1" step="10" inputmode="numeric" placeholder="Ej. 1200"
                   [ngModel]="venta.monto" (ngModelChange)="venta.monto = $event; monto.set($event)" name="monto" [attr.aria-invalid]="err().monto ? true : null" />
            <span class="err">{{ err().monto }}</span>
          </div>
          <div class="field">
            <label for="v-as">Asesor responsable *</label>
            <select id="v-as" class="sel" [(ngModel)]="venta.asesor" name="asesor">
              @for (a of data.asesores; track a.id) { <option [ngValue]="a.id">{{ a.n }}</option> }
            </select>
          </div>
        </div>

        <fieldset class="field">
          <legend>Estado de validación *</legend>
          <div class="rchips">
            @for (e of estados; track e) {
              <label class="rchip"><input type="radio" name="estado" [value]="e" [(ngModel)]="venta.estado" /><span>{{ e }}</span></label>
            }
          </div>
        </fieldset>

        <div class="field">
          <label for="v-obs">Observaciones</label>
          <textarea id="v-obs" maxlength="240" [(ngModel)]="venta.observaciones" name="observaciones" placeholder="Qué acordaron con el cliente"></textarea>
        </div>

        <div class="row-actions">
          <button type="button" class="btn" (click)="cancelar()">Cancelar</button>
          <button type="submit" class="btn pri">Guardar venta</button>
        </div>
      </form>

      <aside class="card impact" aria-live="polite">
        <div>
          <h2>Impacto en los indicadores</h2>
          <p class="sub">Cómo quedarían las cifras de los últimos 30 días con esta venta</p>
        </div>
        <div class="imp"><span>Ventas de los últimos 30 días</span><b>{{ num(base.v + 1) }}</b></div>
        <div class="imp"><span>Ingreso estimado</span><b>{{ money(base.mon + (monto() || 0)) }}</b></div>
        <div class="imp"><span>Venta promedio</span><b>{{ money((base.mon + (monto() || 0)) / (base.v + 1)) }}</b></div>
        <div class="imp"><span>Comisión del asesor</span><b>{{ money(data.COMISION) }}</b></div>
        <p class="note">Las ventas «Pendiente» u «Observado» se cuentan cuando calidad las aprueba.</p>
      </aside>
    </div>
  `
})
export class SaleFormComponent {
  data = inject(DemoDataService);
  money = money;
  num = num;
  estados = ['Aprobado', 'Pendiente', 'Observado'];

  venta: VentaNueva = {
    tipoDoc: 'DNI',
    nroDoc: '',
    nombreCliente: '',
    campana: this.data.campanas[0].id,
    producto: this.data.campanas[0].prods[0],
    monto: null,
    asesor: 0,
    estado: 'Aprobado',
    telefono: '',
    observaciones: ''
  };

  private campana = signal(this.venta.campana);
  productos = computed(() => this.data.campana(this.campana()).prods);
  monto = signal<number | null>(null);
  base = this.data.agregar(...this.data.rango(30), this.data.asesores.map(a => a.id));
  err = signal<Partial<Record<Campo, string>>>({});

  @Output() onSubmit = new EventEmitter<VentaNueva>();
  @Output() onCancel = new EventEmitter<void>();

  cambiarCampana(id: string) {
    this.campana.set(id);
    this.venta.producto = this.data.campana(id).prods[0];
  }

  guardarVenta() {
    const v = this.venta;
    const reDoc = v.tipoDoc === 'DNI' ? /^\d{8}$/ : v.tipoDoc === 'RUC' ? /^\d{11}$/ : /^\d{9,12}$/;
    const e: Partial<Record<Campo, string>> = {};
    if (!reDoc.test(v.nroDoc.trim())) e.nroDoc = v.tipoDoc === 'DNI' ? 'El DNI debe tener 8 dígitos.' : v.tipoDoc === 'RUC' ? 'El RUC debe tener 11 dígitos.' : 'El carné debe tener entre 9 y 12 dígitos.';
    if (v.nombreCliente.trim().length < 3) e.nombreCliente = 'Escribe el nombre o la razón social.';
    if (!(Number(v.monto) > 0)) e.monto = 'Ingresa el ingreso estimado de la venta (mayor que cero).';
    if (v.telefono.trim() && !/^9\d{8}$/.test(v.telefono.trim())) e.telefono = 'El teléfono debe tener 9 dígitos y empezar con 9.';
    this.err.set(e);
    if (Object.keys(e).length) return;
    this.onSubmit.emit({ ...v, nroDoc: v.nroDoc.trim(), nombreCliente: v.nombreCliente.trim() });
  }

  cancelar() {
    this.onCancel.emit();
  }
}
