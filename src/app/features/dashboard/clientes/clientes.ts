import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ClientFormComponent } from '../../../shared/components/client-form/client-form';
import { ClientDrawerComponent } from '../../../shared/components/client-drawer/client-drawer';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { ToastService } from '../../../shared/components/toast/toast';
import { Cliente, DemoDataService, NuevoCliente } from '../../../core/services/demo-data.service';
import { estadoPill, sinTildes } from '../../../shared/utils/formato';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ClientFormComponent, ClientDrawerComponent, PageHeadComponent, PillComponent, CampChipComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent {
  data = inject(DemoDataService);
  private toast = inject(ToastService);
  estadoPill = estadoPill;

  mostrarFormulario = signal(false);
  ficha = signal<Cliente | null>(null);
  busqueda = signal('');
  estado = signal('todos');
  limite = signal(12);

  columnasClientes: string[] = [
    'Cliente',
    'Asesor',
    'Campaña',
    'Estado',
    'Último contacto',
    'Próximo seguimiento',
    ''
  ];

  lista = computed(() => {
    const q = sinTildes(this.busqueda().trim()), est = this.estado();
    return this.data.clientes()
      .filter(c => (est === 'todos' || c.estado === est) && (!q || sinTildes(c.nombre).includes(q) || c.doc.includes(q)))
      .sort((a, b) => (b.ultimo ?? -1) - (a.ultimo ?? -1));
  });
  visibles = computed(() => this.lista().slice(0, this.limite()));

  buscar(q: string) {
    this.busqueda.set(q);
    this.limite.set(12);
  }

  filtrarEstado(e: string) {
    this.estado.set(e);
    this.limite.set(12);
  }

  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
  }

  guardarCliente(datos: NuevoCliente) {
    const c = this.data.agregarCliente(datos);
    this.mostrarFormulario.set(false);
    this.toast.show('Cliente registrado: ' + c.nombre);
  }
}
