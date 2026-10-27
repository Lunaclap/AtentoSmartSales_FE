import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card bg-black border-secondary text-light p-4 shadow-lg rounded-4">
      <!-- Cabecera -->
      <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
        <div>
          <h4 class="fw-bold mb-1">Registro de Nuevo Cliente en Cartera</h4>
          <p class="text-muted small mb-0">Añade un prospecto o cuenta corporativa para asignarlo a las campañas del call center.</p>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary text-light px-3" (click)="cancelar()">✕ Cerrar</button>
      </div>

      <form (ngSubmit)="guardarCliente()">
        <div class="row g-4">
          
          <!-- SECCIÓN 1: DATOS GENERALES -->
          <div class="col-12">
            <h6 class="fw-bold text-primary mb-3">1. Datos de Identificación</h6>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Tipo de Cliente</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.tipo" name="tipo">
              <option value="Persona">Persona Natural</option>
              <option value="Empresa">Empresa / Razón Social</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Tipo de Documento</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.tipoDoc" name="tipoDoc">
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Número de Documento</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.doc" name="doc" placeholder="Ej. 11731842" required />
          </div>

          <div class="col-12">
            <label class="form-label small text-muted">Nombre Completo o Razón Social</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.nombre" name="nombre" placeholder="Ej. Víctor Flores Salas / Constructora Surco S.A.C." required />
          </div>


          <!-- SECCIÓN 2: CONTACTO Y CANALES -->
          <div class="col-12 pt-2">
            <h6 class="fw-bold text-primary mb-3">2. Información de Contacto</h6>
          </div>

          <div class="col-md-6">
            <label class="form-label small text-muted">Teléfono / Celular de Contacto</label>
            <input type="text" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.telefono" name="telefono" placeholder="Ej. 987 654 321" required />
          </div>

          <div class="col-md-6">
            <label class="form-label small text-muted">Correo Electrónico</label>
            <input type="email" class="form-control form-control-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.correo" name="correo" placeholder="Ej. correo&#64;dominio.com" />
          </div>


          <!-- SECCIÓN 3: ASIGNACIÓN OPERATIVA (CALL CENTER) -->
          <div class="col-12 pt-2">
            <h6 class="fw-bold text-primary mb-3">3. Asignación y Seguimiento Operativo</h6>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Asesor Asignado</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.asesor" name="asesor" required>
              <option value="Andrea Rojas">Andrea Rojas</option>
              <option value="Diego Salazar">Diego Salazar</option>
              <option value="Valeria Chávez">Valeria Chávez</option>
              <option value="Kevin Torres">Kevin Torres</option>
              <option value="Camila Flores">Camila Flores</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Campaña Comercial</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.campana" name="campana" required>
              <option value="Préstamos">Préstamos Personales</option>
              <option value="Telefonía móvil">Telefonía Móvil</option>
              <option value="Seguros de salud">Seguros de Salud</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted">Estado Inicial</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.estado" name="estado">
              <option value="Contactado">Contactado</option>
              <option value="Interesado">Interesado</option>
              <option value="Cerrado">Cerrado (Venta Exitosa)</option>
              <option value="No contesta">No contesta</option>
            </select>
          </div>

          <div class="col-md-6 pt-2">
            <label class="form-label small text-muted">Próximo Seguimiento</label>
            <select class="form-select form-select-sm bg-black text-light border-secondary py-2" [(ngModel)]="cliente.proximoSeguimiento" name="proximoSeguimiento">
              <option value="Hoy">Para hoy</option>
              <option value="En 1 d">En 1 día</option>
              <option value="En 2 d">En 2 días</option>
              <option value="En 5 d">En 5 días</option>
              <option value="—">Sin programar (—)</option>
            </select>
          </div>


          <!-- BOTONES DE ACCIÓN -->
          <div class="col-12 d-flex justify-content-end gap-3 pt-3 border-top border-secondary">
            <button type="button" class="btn btn-outline-secondary px-4 py-2 text-light" (click)="cancelar()">Cancelar</button>
            <button type="submit" class="btn btn-primary px-5 py-2 fw-semibold shadow">Guardar Cliente en Cartera</button>
          </div>

        </div>
      </form>
    </div>
  `
})
export class ClientFormComponent {
  cliente = {
    tipo: 'Persona',
    tipoDoc: 'DNI',
    doc: '',
    nombre: '',
    telefono: '',
    correo: '',
    asesor: 'Andrea Rojas',
    campana: 'Préstamos',
    estado: 'Contactado',
    proximoSeguimiento: 'En 2 d'
  };

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  guardarCliente() {
    if (!this.cliente.doc || !this.cliente.nombre || !this.cliente.telefono) {
      alert('Por favor completa los campos obligatorios (Documento, Nombre y Teléfono).');
      return;
    }
    this.onSubmit.emit(this.cliente);
    alert('¡Cliente registrado en la cartera exitosamente!');
  }

  cancelar() {
    this.onCancel.emit();
  }
}