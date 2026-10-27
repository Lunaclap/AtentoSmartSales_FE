import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card bg-black border-secondary text-light p-4 shadow-lg rounded-4">
      <!-- Cabecera -->
      <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
        <div>
          <h4 class="fw-bold mb-1">Registro Operativo de Venta / Call Center</h4>
          <p class="text-muted small mb-0">Captura todos los parámetros del cierre de llamada para actualizar tableros y comisiones.</p>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary text-light px-3" (click)="cancelar()">✕ Cerrar</button>
      </div>

      <form (ngSubmit)="guardarVenta()">
        <div class="row g-4">
          
          <!-- SECCIÓN 1: DATOS DEL CLIENTE -->
          <div class="col-12">
            <h6 class="fw-bold text-primary mb-3">1. Identificación del Cliente</h6>
          </div>
          
          <div class="col-md-4">
            <label class="form-label small text-muted">Tipo de Documento</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.tipoDoc" name="tipoDoc">
              <option value="DNI">DNI</option>
              <option value="RUC">RUC (Empresa)</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Número de Documento</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.nroDoc" name="nroDoc" placeholder="Ej. 48772910" required />
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Nombre o Razón Social</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.nombreCliente" name="nombreCliente" placeholder="Ej. Roberto Gómez Bolaños" required />
          </div>


          <!-- SECCIÓN 2: DETALLES DE LA CAMPAÑA Y OPERACIÓN -->
          <div class="col-12 pt-2">
            <h6 class="fw-bold text-primary mb-3">2. Detalles de la Negociación</h6>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Campaña Asignada</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.campana" name="campana" required>
              <option value="prestamos">● Préstamos Personales / Efectivo</option>
              <option value="telefonia">● Telefonía Móvil (Postpago/Porta)</option>
              <option value="seguros">● Seguros de Salud / Oncológicos</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Subtipo de Operación</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.subtipo" name="subtipo">
              <option value="linea-nueva">Línea Nueva / Crédito Directo</option>
              <option value="portabilidad">Portabilidad numérica</option>
              <option value="renovacion">Renovación de equipo / Ampliación</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Monto de Cierre / Crédito (S/)</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-black text-muted border-secondary">S/</span>
              <input type="number" class="form-control bg-black text-light border-secondary py-2" [(ngModel)]="venta.monto" name="monto" placeholder="1500.00" required />
            </div>
          </div>


          <!-- SECCIÓN 3: ASESOR Y ESTADO DE VALIDACIÓN -->
          <div class="col-12 pt-2">
            <h6 class="fw-bold text-primary mb-3">3. Control y Auditoría Telefónica</h6>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Asesor Responsable</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.asesor" name="asesor" required>
              <option value="diego-salazar">Diego Salazar</option>
              <option value="lucia-quispe">Lucía Quispe</option>
              <option value="fiorella-vega">Fiorella Vega</option>
              <option value="marisol-huaman">Marisol Huamán</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Estado de Validación</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.estado" name="estado">
              <option value="Aprobado">Aprobado (Venta Exitosa)</option>
              <option value="Pendiente">Pendiente de Auditoría / Validación</option>
              <option value="Observado">Observado por Calidad</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Teléfono de Contacto</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="venta.telefono" name="telefono" placeholder="987654321" />
          </div>


          <!-- SECCIÓN 4: OBSERVACIONES -->
          <div class="col-12 pt-2">
            <h6 class="fw-bold text-primary mb-3">4. Comentarios de la Llamada</h6>
            <textarea class="form-control bg-black text-light border-secondary" rows="3" [(ngModel)]="venta.observaciones" name="observaciones" placeholder="Ej. Cliente aceptó la oferta tras cotizar tasa preferencial. Audio de conformidad grabado satisfactoriamente..."></textarea>
          </div>

          <!-- BOTONES DE ACCIÓN -->
          <div class="col-12 d-flex justify-content-end gap-3 pt-3 border-top border-secondary">
            <button type="button" class="btn btn-outline-secondary px-4 py-2 text-light" (click)="cancelar()">Cancelar</button>
            <button type="submit" class="btn btn-primary px-5 py-2 fw-semibold shadow">Guardar y Enviar Operación</button>
          </div>

        </div>
      </form>
    </div>
  `
})
export class SaleFormComponent {
  venta = {
    tipoDoc: 'DNI',
    nroDoc: '',
    nombreCliente: '',
    campana: 'prestamos',
    subtipo: 'linea-nueva',
    monto: null,
    asesor: 'diego-salazar',
    estado: 'Aprobado',
    telefono: '',
    observaciones: ''
  };

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  guardarVenta() {
    if (!this.venta.nroDoc || !this.venta.nombreCliente || !this.venta.monto) {
      alert('Por favor completa los campos obligatorios (Documento, Nombre y Monto).');
      return;
    }
    this.onSubmit.emit(this.venta);
    alert('¡Operación de venta registrada y validada correctamente!');
  }

  cancelar() {
    this.onCancel.emit();
  }
}