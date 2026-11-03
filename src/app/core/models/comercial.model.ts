// Tipos que entrega la API comercial del backend. Las fechas llegan como texto ISO.

export interface Item { id: number; nombre: string }

export interface Catalogos {
  campanas: Item[];
  modalidades: Item[];
  estadosGestion: string[];
  tipificaciones: string[];
  /** Opciones del selector de tipificación al registrar una gestión. */
  resultados: string[];
  estadosVenta: string[];
  asesores: Item[];
  montos: number[];
}

export interface Cliente {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  correo: string | null;
  telefono: string | null;
  campana: string | null;
  vencimientoCampana: string | null;
  estadoGestion: string;
  tipificacion: string | null;
  ultimoContacto: string | null;
  seguimiento: string | null;
  asesorId: number | null;
  asesor: string | null;
}

export interface Gestion {
  id: number;
  fecha: string;
  asesor: string;
  campana: string | null;
  modalidad: string | null;
  estadoGestion: string;
  tipificacion: string | null;
  monto: number | null;
  comentario: string | null;
  fechaSeguimiento: string | null;
}

export interface Venta {
  id: number;
  clienteId: number;
  cliente: string;
  documento: string;
  campana: string;
  modalidad: string;
  monto: number;
  fecha: string;
  estado: string;
  /** Solo llegan cuando quien consulta es gerente. */
  asesorId?: number;
  asesor?: string;
  devuelta: boolean;
}

export interface FichaCliente {
  cliente: Cliente;
  resumen: { gestiones: number; ventasCerradas: number; ventasPendientes: number; montoCerrado: number };
  historial: Gestion[];
  ventas: Venta[];
}

export interface NuevaGestion {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  campanaId: number | null;
  modalidadId: number | null;
  resultado: string;
  monto: number | null;
  asesorId: number | null;
  comentario: string;
  fechaSeguimiento: string | null;
}

export interface GestionRegistrada { cliente: Cliente; venta: Venta | null }

export interface AvanceMeta { meta: number; cierres: number; avance: number }

export interface VentasRespuesta { ventas: Venta[]; meta: AvanceMeta }

export interface FilaAsesor {
  asesorId: number | null;
  asesor: string;
  gestiones: number;
  cierres: number;
  pendientes: number;
  monto: number;
  ticketPromedio: number;
  meta: number;
  avanceMeta: number;
}

export interface ReporteAsesores { periodo: string; filas: FilaAsesor[]; total: FilaAsesor }

export interface PuntoDia { fecha: string; cierres: number; gestiones: number }

export interface DetalleAsesor {
  periodo: string;
  resumen: FilaAsesor;
  cierresMesAnterior: number;
  avancePromedioDiario: number;
  ritmoNecesario: number;
  diasRestantes: number;
  campanas: { campana: string; cierres: number; monto: number }[];
  dias: PuntoDia[];
  ventas: Venta[];
}

export interface KpiCampana {
  id: number;
  campana: string;
  gestiones: number;
  cierres: number;
  pendientes: number;
  monto: number;
  ticketPromedio: number;
  conversion: number;
  cierresMesAnterior: number;
  cierresPorModalidad: Record<string, number>;
}

export interface ResumenGerente {
  periodo: string;
  gestiones: number;
  cierres: number;
  cierresMesAnterior: number;
  pendientes: number;
  monto: number;
  ticketPromedio: number;
  meta: number;
  avanceMeta: number;
  avancePromedioDiario: number;
  diasRestantes: number;
  dias: PuntoDia[];
  campanas: KpiCampana[];
  asesores: FilaAsesor[];
  clientesPorEstado: Record<string, number>;
}

export interface MetaAsesor { asesorId: number; asesor: string; meta: number; cierres: number; cierresMesAnterior: number }
