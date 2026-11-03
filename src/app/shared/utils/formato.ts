const nf = new Intl.NumberFormat('es-PE');

export const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const num = (v: number) => nf.format(Math.round(v));
export const money = (v: number) => 'S/ ' + num(v);
export const pc = (v: number, d = 1) => (v * 100).toFixed(d).replace('.', ',') + ' %';

export const fechaLarga = (d: Date) =>
  `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} de ${d.getFullYear()}`;

/** Quita tildes y pasa a minúsculas para comparar textos en búsquedas. */
export const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export interface Pill { cls: '' | 'ok' | 'warn' | 'crit' | 'acc'; icon: string; label: string }

export function metaPill(p: number): Pill {
  if (p >= 1) return { cls: 'ok', icon: 'check', label: 'En meta' };
  if (p >= 0.7) return { cls: 'warn', icon: 'alert', label: 'En riesgo' };
  return { cls: 'crit', icon: 'x', label: 'Bajo la meta' };
}

export function estadoPill(e: string): Pill {
  if (e === 'Cerrado') return { cls: 'ok', icon: 'check', label: e };
  if (e === 'Perdido') return { cls: 'crit', icon: 'x', label: e };
  if (e === 'Interesado') return { cls: 'acc', icon: 'dot', label: e };
  return { cls: '', icon: 'ring', label: e };
}

export function resultadoPill(r: string): Pill {
  if (r === 'venta') return { cls: 'ok', icon: 'check', label: 'Venta' };
  if (r === 'interesado') return { cls: 'acc', icon: 'dot', label: 'Interesado' };
  if (r === 'rechazo') return { cls: 'crit', icon: 'x', label: 'Rechazo' };
  return { cls: '', icon: 'ring', label: 'No contesta' };
}
