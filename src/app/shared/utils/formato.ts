const nf = new Intl.NumberFormat('es-PE');
const nf2 = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const num = (v: number) => nf.format(Math.round(v));
/** Montos en soles con céntimos: los planes cuestan S/ 39,90, etc. */
export const money = (v: number) => 'S/ ' + nf2.format(v ?? 0);
export const pc = (v: number, d = 1) => (v * 100).toFixed(d).replace('.', ',') + ' %';
export const dec = (v: number, d = 1) => v.toFixed(d).replace('.', ',');

/** Valor o guion cuando no hay dato (REQ-19). */
export const guion = (v: unknown) => (v === null || v === undefined || v === '' ? '-' : String(v));

export const fechaLarga = (d: Date) =>
  `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} de ${d.getFullYear()}`;

/** "3 nov" a partir de una fecha ISO; "-" si no hay fecha. */
export const fechaCorta = (iso: string | null | undefined) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.getDate() + ' ' + MESES[d.getMonth()];
};

/** "3 nov, 10:30". */
export const fechaHora = (iso: string | null | undefined) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getDate()} ${MESES[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Días de calendario entre hoy y la fecha (negativo = pasado). */
export const diasDesdeHoy = (iso: string) => {
  const d = new Date(iso), h = new Date();
  const a = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), b = Date.UTC(h.getFullYear(), h.getMonth(), h.getDate());
  return Math.round((a - b) / 86400000);
};

/** "Hoy", "Ayer", "Hace 3 d", "En 2 d". */
export const relativa = (iso: string | null | undefined) => {
  if (!iso) return '-';
  const x = diasDesdeHoy(iso);
  return x === 0 ? 'Hoy' : x === -1 ? 'Ayer' : x === 1 ? 'Mañana' : x < 0 ? `Hace ${-x} d` : `En ${x} d`;
};

/** Periodos AAAA-MM: el mes actual y los anteriores, para los selectores de mes. */
export function periodos(cuantos = 6): { valor: string; texto: string }[] {
  const h = new Date();
  return Array.from({ length: cuantos }, (_, i) => {
    const d = new Date(h.getFullYear(), h.getMonth() - i, 1);
    const texto = MESES_LARGOS[d.getMonth()] + ' ' + d.getFullYear();
    return { valor: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, texto: texto[0].toUpperCase() + texto.slice(1) };
  });
}

export const periodoActual = () => periodos(1)[0].valor;

/** Quita tildes y pasa a minúsculas para comparar textos en búsquedas. */
export const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export interface Pill { cls: '' | 'ok' | 'warn' | 'crit' | 'acc'; icon: string; label: string }

export function metaPill(p: number): Pill {
  if (p >= 1) return { cls: 'ok', icon: 'check', label: 'En meta' };
  if (p >= 0.7) return { cls: 'warn', icon: 'alert', label: 'En riesgo' };
  return { cls: 'crit', icon: 'x', label: 'Bajo la meta' };
}

/** Estado de gestión del cliente: Contactado, Aprobado, No contactado, Black List, Rechazado. */
export function gestionPill(e: string): Pill {
  if (e === 'Aprobado') return { cls: 'ok', icon: 'check', label: e };
  if (e === 'Contactado') return { cls: 'acc', icon: 'dot', label: e };
  if (e === 'Rechazado') return { cls: 'crit', icon: 'x', label: e };
  if (e === 'Black List') return { cls: 'crit', icon: 'alert', label: e };
  return { cls: '', icon: 'ring', label: e };
}

/** Tipificación de la llamada; sin tipificación muestra "-". */
export function tipificacionPill(t: string | null): Pill {
  if (!t) return { cls: '', icon: 'ring', label: '-' };
  if (t === 'Exitosa') return { cls: 'ok', icon: 'check', label: t };
  if (t === 'Agendada') return { cls: 'acc', icon: 'dot', label: t };
  if (t === 'Retornado') return { cls: 'warn', icon: 'alert', label: t };
  return { cls: 'crit', icon: 'x', label: t };
}

export function ventaPill(e: string): Pill {
  return e === 'Cerrado' ? { cls: 'ok', icon: 'check', label: e } : { cls: 'warn', icon: 'ring', label: e };
}

/** Color fijo por campaña para gráficos y etiquetas. */
const COLORES: Record<string, string> = {
  'Mitad de precio x 6m': 'var(--c1)',
  'Navidad': 'var(--c2)',
  'Plan familiar': 'var(--c3)'
};
export const colorCampana = (n: string | null) => (n && COLORES[n]) || 'var(--muted)';
