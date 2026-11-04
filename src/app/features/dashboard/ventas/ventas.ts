import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { GestionFormComponent } from '../../../shared/components/gestion-form/gestion-form';
import { ClientDrawerComponent } from '../../../shared/components/client-drawer/client-drawer';
import { ToastService } from '../../../shared/components/toast/toast';
import { ComercialService, esGerente, mensajeError } from '../../../core/services/comercial.service';
import { AvanceMeta, Cliente, GestionRegistrada, Venta } from '../../../core/models/comercial.model';
import { fechaHora, guion, metaPill, money, num, pc, relativa, sinTildes, ventaPill } from '../../../shared/utils/formato';

/**
 * Módulo Ventas (REQ-24): las ventas devueltas a gestión no aparecen (REQ-31).
 * La columna Asesor solo existe si el backend la envía, es decir, para el gerente (REQ-14).
 */
@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [FormsModule, PageHeadComponent, KpiCardComponent, DataTableComponent, PillComponent, CampChipComponent,
    GestionFormComponent, ClientDrawerComponent],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {
  private api = inject(ComercialService);
  private toast = inject(ToastService);
  money = money; num = num; pc = pc; guion = guion; fechaHora = fechaHora; relativa = relativa; ventaPill = ventaPill; metaPill = metaPill;

  gerente = esGerente();
  ventas = signal<Venta[]>([]);
  meta = signal<AvanceMeta | null>(null);
  cargando = signal(true);
  error = signal('');
  catalogo = this.api.catalogo;

  busqueda = signal('');
  estado = signal('todos');
  campana = signal('todas');
  limite = signal(25);

  formulario = signal(false);
  fichaId = signal<number | null>(null);
  nuevaDesdeFicha = signal<Cliente | null>(null);
  cerrando = signal<number | null>(null);

  /** La columna Asesor se muestra solo si las ventas la traen. */
  conAsesor = computed(() => this.ventas().some(v => v.asesor));
  columnas = computed(() => [
    'ID venta', 'Cliente', 'Teléfono', 'Campaña', 'Modalidad', 'Monto', 'Fecha', 'Estado de venta',
    ...(this.conAsesor() ? ['Asesor'] : []), ...(this.gerente ? [''] : [])
  ]);

  lista = computed(() => {
    const q = sinTildes(this.busqueda().trim()), e = this.estado(), c = this.campana();
    return this.ventas().filter(v =>
      (e === 'todos' || v.estado === e) && (c === 'todas' || v.campana === c) &&
      (!q || sinTildes(v.cliente).includes(q) || v.documento.includes(q) || v.telefono?.includes(q) || String(v.id) === q));
  });
  visibles = computed(() => this.lista().slice(0, this.limite()));

  totales = computed(() => {
    const l = this.ventas();
    const cerradas = l.filter(v => v.estado === 'Cerrado');
    return {
      pendientes: l.length - cerradas.length,
      monto: cerradas.reduce((t, v) => t + v.monto, 0)
    };
  });

  ngOnInit() {
    this.api.cargarCatalogos().subscribe({ error: () => {} });
    this.cargar();
  }

  cargar() {
    this.api.ventas().subscribe({
      next: r => { this.ventas.set(r.ventas); this.meta.set(r.meta); this.cargando.set(false); },
      error: e => { this.error.set(mensajeError(e, 'No se pudieron cargar las ventas.')); this.cargando.set(false); }
    });
  }

  cerrar(v: Venta) {
    this.cerrando.set(v.id);
    this.api.cerrarVenta(v.id).subscribe({
      next: () => { this.cerrando.set(null); this.toast.show(`Venta #${v.id} marcada como Cerrado.`); this.cargar(); },
      error: e => { this.cerrando.set(null); this.toast.show(mensajeError(e), true); }
    });
  }

  registrada(r: GestionRegistrada) {
    this.formulario.set(false);
    this.nuevaDesdeFicha.set(null);
    this.toast.show(r.venta ? `Venta #${r.venta.id} registrada como Pendiente.` : 'Gestión registrada; no generó venta.');
    this.cargar();
  }
}
