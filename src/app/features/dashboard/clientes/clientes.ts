import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ClientDrawerComponent } from '../../../shared/components/client-drawer/client-drawer';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { ComercialService, esGerente, mensajeError } from '../../../core/services/comercial.service';
import { Cliente } from '../../../core/models/comercial.model';
import { diasDesdeHoy, fechaCorta, gestionPill, guion, relativa, sinTildes, tipificacionPill } from '../../../shared/utils/formato';

/** Módulo Clientes (REQ-18 a REQ-21): listado y ficha. Las ventas se registran desde el módulo Ventas. */
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule, DataTableComponent, ClientDrawerComponent, PageHeadComponent, PillComponent, CampChipComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {
  private api = inject(ComercialService);
  gestionPill = gestionPill; tipificacionPill = tipificacionPill;
  guion = guion; relativa = relativa; fechaCorta = fechaCorta; diasDesdeHoy = diasDesdeHoy;

  gerente = esGerente();
  clientes = signal<Cliente[]>([]);
  cargando = signal(true);
  error = signal('');
  catalogo = this.api.catalogo;
  /** Los clientes aprobados no se listan aquí: se consultan desde Ventas. */
  estados = computed(() => (this.catalogo()?.estadosGestion ?? []).filter(e => e !== 'Aprobado'));

  busqueda = signal('');
  estado = signal('todos');
  asesor = signal<number | 'todos'>('todos');
  limite = signal(25);

  fichaId = signal<number | null>(null);

  columnas = ['DNI / CE', 'Nombres y apellidos', 'Campaña', 'Venc. campaña', 'Estado de gestión', 'Tipificación', 'Último contacto', 'Seguimiento', 'Acción'];

  lista = computed(() => {
    const q = sinTildes(this.busqueda().trim()), e = this.estado(), a = this.asesor();
    return this.clientes().filter(c =>
      (e === 'todos' || c.estadoGestion === e) &&
      (a === 'todos' || c.asesorId === a) &&
      (!q || sinTildes(c.nombreCompleto).includes(q) || c.numeroDocumento.includes(q)));
  });
  visibles = computed(() => this.lista().slice(0, this.limite()));

  ngOnInit() {
    this.api.cargarCatalogos().subscribe({ error: () => {} });
    this.cargar();
  }

  cargar() {
    this.api.clientes().subscribe({
      next: l => { this.clientes.set(l); this.cargando.set(false); },
      error: e => { this.error.set(mensajeError(e, 'No se pudieron cargar los clientes.')); this.cargando.set(false); }
    });
  }
}
