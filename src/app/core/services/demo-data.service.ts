import { Injectable, signal } from '@angular/core';
import { MESES, sinTildes } from '../../shared/utils/formato';

/*
 * Datos de ejemplo del panel comercial: 12 asesores, 3 campañas y 90 días de gestiones.
 * El generador usa una semilla fija, así que las cifras son las mismas en cada carga.
 * El índice de día 89 es "hoy"; el 0 es hace 89 días.
 */

export type Resultado = 'venta' | 'interesado' | 'noresp' | 'rechazo';
export type EstadoCliente = 'Nuevo' | 'Contactado' | 'Interesado' | 'Cerrado' | 'Perdido';

export interface Campana {
  id: string;
  n: string;
  conv: number;
  meta: number;
  val: [number, number];
  col: string;
  prods: string[];
}

export interface Asesor {
  id: number;
  n: string;
  eq: string;
  camp: string;
  meta: number;
  skill: number;
}

export interface Gestion { a: number; res: Resultado; val: number; prod: string }

export interface Historial { d: number; res: Resultado; val: number; prod: string; nota: string }

export interface Cliente {
  id: number;
  nombre: string;
  doc: string;
  tipo: 'Persona' | 'Empresa';
  tel: string;
  correo: string;
  origen: string;
  asesor: number;
  camp: string;
  estado: EstadoCliente;
  ultimo: number | null;
  prox: number | null;
  hist: Historial[];
}

export type NuevoCliente = Pick<Cliente, 'nombre' | 'doc' | 'tipo' | 'tel' | 'correo' | 'origen' | 'asesor'>;

export interface Filtro { dias: number; campana: string; equipo: string }

export interface Agregado {
  g: number;
  v: number;
  mon: number;
  ef: number;
  it: number;
  days: { d: number; v: number; g: number }[];
  per: Record<number, { g: number; v: number; mon: number }>;
  wd: number;
  meta: number;
  conv: number;
  tick: number;
}

export const FILTRO_INICIAL: Filtro = { dias: 30, campana: 'todas', equipo: 'todos' };

const NASES = ['Lucía Quispe', 'Diego Salazar', 'Marisol Huamán', 'Renzo Cárdenas', 'Camila Flores', 'Jorge Mamani', 'Andrea Rojas', 'Luis Paredes', 'Valeria Chávez', 'Kevin Torres', 'Fiorella Vega', 'Mateo Ramos'];
const NOM = ['Carlos', 'María', 'José', 'Rosa', 'Luis', 'Ana', 'Pedro', 'Carmen', 'Jorge', 'Elena', 'Miguel', 'Patricia', 'Raúl', 'Sofía', 'Héctor', 'Gladys', 'Víctor', 'Milagros', 'Óscar', 'Julia'];
const APE = ['Ramírez', 'Torres', 'Flores', 'Gómez', 'Díaz', 'Vargas', 'Castillo', 'Mendoza', 'Rojas', 'Silva', 'Ortiz', 'Herrera', 'Medina', 'Aguilar', 'Cruz', 'Ponce', 'Salas', 'Vera', 'Campos', 'Ruiz'];
const EMP = ['Inversiones Andina', 'Comercial Los Olivos', 'Servicios Pacífico', 'Transportes Rímac', 'Constructora Surco', 'Distribuidora Miraflores', 'Textiles Gamarra', 'Agroexport Ica'];
const NOTAS = ['Pide que lo llamen en la tarde', 'Solicita la oferta por correo', 'Lo evalúa con su familia', 'Compara con otra empresa', 'Datos confirmados', 'No contesta, se dejó mensaje'];

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  readonly HOY = 89;
  readonly DIAS_LAB_MES = 27;
  readonly COMISION = 15;
  readonly hoy: Date;

  readonly campanas: Campana[] = [
    { id: 'pre', n: 'Préstamos', conv: .075, meta: 27, val: [900, 2400], col: 'var(--c1)', prods: ['Préstamo personal', 'Adelanto de sueldo', 'Compra de deuda'] },
    { id: 'mov', n: 'Telefonía móvil', conv: .11, meta: 38, val: [720, 1800], col: 'var(--c2)', prods: ['Portabilidad postpago', 'Plan postpago', 'Línea nueva'] },
    { id: 'seg', n: 'Seguros de salud', conv: .06, meta: 23, val: [480, 1100], col: 'var(--c3)', prods: ['Seguro oncológico', 'Seguro de accidentes', 'Plan de salud familiar'] }
  ];
  readonly equipos = ['Lima Este', 'Lima Centro', 'Remoto'];
  readonly estados: EstadoCliente[] = ['Nuevo', 'Contactado', 'Interesado', 'Cerrado', 'Perdido'];
  readonly origenes = ['Base de datos', 'Referido', 'Web', 'Campaña de llamadas'];

  readonly asesores: Asesor[];
  readonly clientes = signal<Cliente[]>([]);
  /** Se incrementa cada vez que cambian las metas, para que los indicadores se recalculen. */
  readonly versionMetas = signal(0);

  private readonly gd: Gestion[][] = [];
  private seed = 20261020;

  constructor() {
    const t = new Date();
    this.hoy = new Date(t.getFullYear(), t.getMonth(), t.getDate());

    this.asesores = NASES.map((n, i) => {
      const c = this.campanas[i % 3];
      return { id: i, n, eq: this.equipos[Math.floor(i / 4)], camp: c.id, meta: Math.round(c.meta * (0.9 + this.rnd() * 0.2)), skill: 0.82 + this.rnd() * 0.4 };
    });
    this.asesores[0].skill = 1.1;

    this.generarGestiones();
    this.clientes.set(this.generarClientes());
  }

  // ---------- fechas ----------
  fecha(i: number): Date {
    return new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate() - (this.HOY - i));
  }
  diaSemana(i: number) { return this.fecha(i).getDay(); }
  dm(i: number) { const d = this.fecha(i); return d.getDate() + ' ' + MESES[d.getMonth()]; }
  rel(i: number) {
    const x = i - this.HOY;
    return x === 0 ? 'Hoy' : x === -1 ? 'Ayer' : x > 0 ? 'En ' + x + ' d' : 'Hace ' + (-x) + ' d';
  }
  /** Texto del próximo seguimiento: "Hoy", "Vencido hace 3 d" o "En 2 d". */
  seguimiento(prox: number) {
    if (prox === this.HOY) return 'Hoy';
    return prox < this.HOY ? 'Vencido hace ' + (this.HOY - prox) + ' d' : 'En ' + (prox - this.HOY) + ' d';
  }
  /** Rango [inicio, fin] de `dias` días; `atras` = 1 da el periodo anterior. */
  rango(dias: number, atras = 0): [number, number] {
    const e = this.HOY - atras * dias;
    return [e - dias + 1, e];
  }

  // ---------- consultas ----------
  campana(id: string) { return this.campanas.find(c => c.id === id)!; }
  asesor(id: number) { return this.asesores[id]; }

  idsFiltrados(f: Filtro): number[] {
    return this.asesores
      .filter(a => (f.campana === 'todas' || a.camp === f.campana) && (f.equipo === 'todos' || a.eq === f.equipo))
      .map(a => a.id);
  }

  agregar(s: number, e: number, ids: number[]): Agregado {
    const set = new Set(ids);
    const r: Agregado = { g: 0, v: 0, mon: 0, ef: 0, it: 0, days: [], per: {}, wd: 0, meta: 0, conv: 0, tick: 0 };
    ids.forEach(i => r.per[i] = { g: 0, v: 0, mon: 0 });
    for (let d = Math.max(s, 0); d <= e; d++) {
      if (this.diaSemana(d) === 0) continue;
      let dv = 0, dg = 0;
      for (const x of this.gd[d]) {
        if (!set.has(x.a)) continue;
        dg++; r.g++;
        const p = r.per[x.a]; p.g++;
        if (x.res !== 'noresp') r.ef++;
        if (x.res === 'interesado' || x.res === 'venta') r.it++;
        if (x.res === 'venta') { dv++; r.v++; r.mon += x.val; p.v++; p.mon += x.val; }
      }
      r.days.push({ d, v: dv, g: dg });
    }
    r.wd = r.days.length;
    r.meta = ids.reduce((t, i) => t + this.asesores[i].meta, 0) * r.wd / this.DIAS_LAB_MES;
    r.conv = r.g ? r.v / r.g : 0;
    r.tick = r.v ? r.mon / r.v : 0;
    return r;
  }

  /** Clientes interesados o contactados con seguimiento agendado, los más atrasados primero. */
  pendientes(ids?: number[]): Cliente[] {
    return this.clientes()
      .filter(c => c.prox != null && (c.estado === 'Interesado' || c.estado === 'Contactado') && (!ids || ids.includes(c.asesor)))
      .sort((a, b) => a.prox! - b.prox!);
  }

  /** Ventas individuales registradas en el historial de los clientes, de la más reciente a la más antigua. */
  ventas(ids: number[], desde: number) {
    const out: { cliente: Cliente; h: Historial }[] = [];
    for (const c of this.clientes()) {
      if (!ids.includes(c.asesor)) continue;
      for (const h of c.hist) if (h.res === 'venta' && h.d >= desde) out.push({ cliente: c, h });
    }
    return out.sort((a, b) => b.h.d - a.h.d);
  }

  buscarDocumento(doc: string) { return this.clientes().find(c => c.doc === doc); }

  // ---------- escrituras ----------
  guardarMetas(metas: number[]) {
    this.asesores.forEach((a, i) => a.meta = metas[i]);
    this.versionMetas.update(v => v + 1);
  }

  agregarCliente(datos: NuevoCliente): Cliente {
    const c: Cliente = { ...datos, id: this.clientes().length, camp: this.asesores[datos.asesor].camp, estado: 'Nuevo', ultimo: null, prox: null, hist: [] };
    this.clientes.update(l => [...l, c]);
    return c;
  }

  // ---------- generador ----------
  private rnd() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }
  private pick<T>(a: T[]): T { return a[Math.floor(this.rnd() * a.length)]; }

  private generarGestiones() {
    for (let d = 0; d < 90; d++) {
      this.gd[d] = [];
      if (this.diaSemana(d) === 0) continue;
      for (const a of this.asesores) {
        const c = this.campana(a.camp);
        let n = Math.round(10 + this.rnd() * 6);
        if (this.diaSemana(d) === 6) n = Math.round(n * 0.7);
        const p = c.conv * a.skill * (0.9 + 0.2 * d / 89);
        for (let k = 0; k < n; k++) {
          const u = this.rnd();
          const res: Resultado = u < p ? 'venta' : u < p + .17 ? 'interesado' : u < p + .5 ? 'noresp' : 'rechazo';
          const g: Gestion = { a: a.id, res, val: 0, prod: '' };
          if (res === 'venta') {
            g.val = Math.round((c.val[0] + this.rnd() * (c.val[1] - c.val[0])) / 10) * 10;
            g.prod = this.pick(c.prods);
          }
          this.gd[d].push(g);
        }
      }
    }
  }

  private generarClientes(): Cliente[] {
    const out: Cliente[] = [];
    for (let i = 0; i < 96; i++) {
      const emp = this.rnd() < .12;
      let nombre: string, doc: string;
      if (emp) {
        nombre = this.pick(EMP) + ' S.A.C.';
        doc = '20' + String(100000000 + Math.floor(this.rnd() * 899999999));
      } else {
        nombre = this.pick(NOM) + ' ' + this.pick(APE) + ' ' + this.pick(APE);
        doc = String(10000000 + Math.floor(this.rnd() * 89999999));
      }
      const u = this.rnd();
      const estado: EstadoCliente = u < .12 ? 'Nuevo' : u < .42 ? 'Contactado' : u < .64 ? 'Interesado' : u < .84 ? 'Cerrado' : 'Perdido';
      const as = this.asesores[i % 12];
      const ultimo = estado === 'Nuevo' ? null : this.HOY - Math.floor(this.rnd() * 14);
      const partes = nombre.split(' ');
      const c: Cliente = {
        id: i, nombre, doc, tipo: emp ? 'Empresa' : 'Persona',
        tel: '9' + String(10000000 + Math.floor(this.rnd() * 89999999)),
        correo: emp ? 'contacto@' + sinTildes(partes[0]) + '.com.pe' : sinTildes(partes[0]) + '.' + sinTildes(partes[1]) + '@ejemplo.com',
        origen: this.pick(this.origenes), asesor: as.id, camp: as.camp, estado, ultimo, prox: null, hist: []
      };
      if (ultimo != null) {
        if (estado === 'Interesado' || estado === 'Contactado') c.prox = ultimo + 1 + Math.floor(this.rnd() * 5);
        const cc = this.campana(as.camp);
        const cnt = 1 + Math.floor(this.rnd() * 3);
        let day = ultimo;
        for (let k = 0; k < cnt; k++) {
          const ultimoRes: Record<string, Resultado> = { Contactado: 'noresp', Interesado: 'interesado', Cerrado: 'venta', Perdido: 'rechazo' };
          const res: Resultado = k === 0 ? ultimoRes[estado] : this.pick<Resultado>(['noresp', 'interesado', 'noresp']);
          const venta = res === 'venta';
          c.hist.push({
            d: day, res,
            val: venta ? Math.round((cc.val[0] + this.rnd() * (cc.val[1] - cc.val[0])) / 10) * 10 : 0,
            prod: venta ? this.pick(cc.prods) : '',
            nota: venta ? 'Venta cerrada' : this.pick(NOTAS)
          });
          day -= 2 + Math.floor(this.rnd() * 4);
        }
      }
      out.push(c);
    }
    return out;
  }
}
