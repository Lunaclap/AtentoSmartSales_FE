import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { ToastService } from '../../../shared/components/toast/toast';
import { ComercialService, mensajeError } from '../../../core/services/comercial.service';
import { MetaAsesor } from '../../../core/models/comercial.model';
import { metaPill, num, pc, periodos } from '../../../shared/utils/formato';

/** Metas mensuales de ventas cerradas por asesor. Las usa el cálculo de avance de meta (REQ-15). */
@Component({
  selector: 'app-metas-kpi',
  standalone: true,
  imports: [FormsModule, PageHeadComponent, DataTableComponent],
  templateUrl: './metas-kpi.html',
  styleUrl: './metas-kpi.css'
})
export class MetasKpiComponent implements OnInit {
  private api = inject(ComercialService);
  private toast = inject(ToastService);
  num = num; pc = pc; metaPill = metaPill;

  /** Mes siguiente, actual y los dos anteriores. */
  meses = (() => {
    const h = new Date(), s = new Date(h.getFullYear(), h.getMonth() + 1, 1);
    const txt = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][s.getMonth()];
    return [{ valor: `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}`, texto: txt[0].toUpperCase() + txt.slice(1) + ' ' + s.getFullYear() }, ...periodos(3)];
  })();
  periodo = signal(this.meses[1].valor);
  filas = signal<MetaAsesor[]>([]);
  valores = signal<Record<number, number | null>>({});
  cargando = signal(true);
  guardando = signal(false);
  error = signal('');

  columnas = ['Asesor', 'Meta (ventas cerradas)', 'Cierres del mes', 'Mes anterior', 'Avance'];

  invalidos = computed(() => {
    const v = this.valores();
    return new Set(this.filas().filter(f => { const x = v[f.asesorId]; return x == null || !Number.isInteger(x) || x < 1 || x > 500; }).map(f => f.asesorId));
  });
  total = computed(() => Object.values(this.valores()).reduce<number>((t, x) => t + (x || 0), 0));
  cambios = computed(() => this.filas().some(f => this.valores()[f.asesorId] !== f.meta));

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.api.metas(this.periodo()).subscribe({
      next: l => this.aplicar(l),
      error: e => { this.error.set(mensajeError(e, 'No se pudieron cargar las metas.')); this.cargando.set(false); }
    });
  }

  private aplicar(l: MetaAsesor[]) {
    this.filas.set(l);
    this.valores.set(Object.fromEntries(l.map(f => [f.asesorId, f.meta || null])));
    this.cargando.set(false);
  }

  cambiar(id: number, v: number | null) {
    this.valores.update(x => ({ ...x, [id]: v }));
  }

  avance(f: MetaAsesor) {
    const m = this.valores()[f.asesorId];
    return m ? f.cierres / m : 0;
  }

  guardar() {
    if (this.invalidos().size) {
      this.toast.show('Revisa las metas marcadas: deben ser números enteros entre 1 y 500.', true);
      return;
    }
    this.guardando.set(true);
    const cambios = this.filas().map(f => ({ asesorId: f.asesorId, meta: this.valores()[f.asesorId]! }));
    this.api.guardarMetas(this.periodo(), cambios).subscribe({
      next: l => { this.guardando.set(false); this.aplicar(l); this.toast.show('Metas guardadas. Los reportes ya usan los nuevos valores.'); },
      error: e => { this.guardando.set(false); this.toast.show(mensajeError(e, 'No se pudieron guardar las metas.'), true); }
    });
  }
}
