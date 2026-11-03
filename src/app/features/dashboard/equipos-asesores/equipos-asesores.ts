import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head';
import { ChartPanelComponent } from '../../../shared/components/chart-panel/chart-panel';
import { CampChipComponent, PillComponent } from '../../../shared/components/pill/pill';
import { DemoDataService, FILTRO_INICIAL, Filtro } from '../../../core/services/demo-data.service';
import { metaPill, num, pc } from '../../../shared/utils/formato';

@Component({
  selector: 'app-equipos-asesores',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, DataTableComponent, PageHeadComponent, ChartPanelComponent, PillComponent, CampChipComponent],
  templateUrl: './equipos-asesores.html',
  styleUrl: './equipos-asesores.css'
})
export class EquiposAsesoresComponent {
  data = inject(DemoDataService);
  num = num; pc = pc; metaPill = metaPill;

  filtro = signal<Filtro>(FILTRO_INICIAL);

  columnasAsesores: string[] = [
    'Asesor',
    'Equipo',
    'Campaña',
    'Gestiones',
    'Ventas',
    'Conversión',
    'Avance de meta',
    'Estado'
  ];
  derecha = ['Gestiones', 'Ventas', 'Conversión'];

  vm = computed(() => {
    this.data.versionMetas();
    const f = this.filtro(), ids = this.data.idsFiltrados(f), r = this.data.rango(f.dias);
    const cur = this.data.agregar(r[0], r[1], ids);

    const equipos = this.data.equipos
      .filter(e => f.equipo === 'todos' || f.equipo === e)
      .map(e => {
        const tid = ids.filter(i => this.data.asesor(i).eq === e);
        if (!tid.length) return null;
        const a = this.data.agregar(r[0], r[1], tid);
        return { e, a, n: tid.length, cm: a.meta ? a.v / a.meta : 0 };
      })
      .filter(x => x !== null);

    const asesores = ids.map(i => {
      const p = cur.per[i], m = this.data.asesor(i).meta * cur.wd / this.data.DIAS_LAB_MES;
      return { a: this.data.asesor(i), p, m, pm: m ? p.v / m : 0 };
    }).sort((a, b) => b.p.v - a.p.v);

    return { equipos, asesores, dias: f.dias };
  });

  onFiltroCambio(f: Filtro) {
    this.filtro.set(f);
  }
}
