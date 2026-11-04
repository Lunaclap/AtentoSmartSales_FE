import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import {
  Catalogos, Cliente, DetalleAsesor, FichaCliente, GestionRegistrada, KpiCampana, MetaAsesor,
  NuevaGestion, ReporteAsesores, ResumenGerente, Venta, VentasRespuesta
} from '../models/comercial.model';
import { API_BASE_URL } from '../api.config';

const API = `${API_BASE_URL}/api`;

/** Rol guardado al iniciar sesión. El backend vuelve a validar los permisos en cada llamada. */
export const rolActual = () => localStorage.getItem('userRole') || '';
export const esGerente = () => ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(rolActual());

/** Mensaje legible de un error HTTP: el que manda el backend o uno genérico. */
export function mensajeError(e: unknown, porDefecto = 'No se pudo completar la operación.'): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) return 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.';
    if (e.status === 403 && !e.error?.message) return 'No tienes permiso para ver esta información.';
    return e.error?.message || porDefecto;
  }
  return porDefecto;
}

/** Acceso a la API comercial: catálogos, clientes, gestiones, ventas, reportes y metas. */
@Injectable({ providedIn: 'root' })
export class ComercialService {
  private http = inject(HttpClient);
  private catalogos$?: Observable<Catalogos>;

  /** Catálogos cargados (se piden una sola vez por sesión). */
  readonly catalogo = signal<Catalogos | null>(null);

  cargarCatalogos(): Observable<Catalogos> {
    if (!this.catalogos$) {
      this.catalogos$ = this.http.get<Catalogos>(`${API}/catalogos`).pipe(
        tap({ next: c => this.catalogo.set(c), error: () => (this.catalogos$ = undefined) }),
        shareReplay(1)
      );
    }
    return this.catalogo() ? of(this.catalogo()!) : this.catalogos$;
  }

  /** Al cerrar sesión: otro usuario puede tener otros asesores disponibles. */
  limpiar() {
    this.catalogos$ = undefined;
    this.catalogo.set(null);
  }

  clientes() { return this.http.get<Cliente[]>(`${API}/clientes`); }
  ficha(id: number) { return this.http.get<FichaCliente>(`${API}/clientes/${id}`); }
  clientePorDocumento(doc: string) { return this.http.get<Cliente>(`${API}/clientes/documento/${encodeURIComponent(doc)}`); }
  registrarGestion(g: NuevaGestion) { return this.http.post<GestionRegistrada>(`${API}/gestiones`, g); }

  ventas() { return this.http.get<VentasRespuesta>(`${API}/ventas`); }
  cerrarVenta(id: number) { return this.http.put<Venta>(`${API}/ventas/${id}/cerrar`, {}); }

  resumen(periodo: string) { return this.http.get<ResumenGerente>(`${API}/reportes/resumen`, { params: { periodo } }); }
  reporteAsesores(periodo: string, campanaId?: number | null, modalidadId?: number | null) {
    let params = new HttpParams().set('periodo', periodo);
    if (campanaId) params = params.set('campanaId', campanaId);
    if (modalidadId) params = params.set('modalidadId', modalidadId);
    return this.http.get<ReporteAsesores>(`${API}/reportes/asesores`, { params });
  }
  detalleAsesor(id: number, periodo: string) { return this.http.get<DetalleAsesor>(`${API}/reportes/asesores/${id}`, { params: { periodo } }); }
  miReporte(periodo: string) { return this.http.get<DetalleAsesor>(`${API}/reportes/mi-reporte`, { params: { periodo } }); }
  reporteCampanas(periodo: string) { return this.http.get<KpiCampana[]>(`${API}/reportes/campanas`, { params: { periodo } }); }

  metas(periodo: string) { return this.http.get<MetaAsesor[]>(`${API}/metas`, { params: { periodo } }); }
  guardarMetas(periodo: string, cambios: { asesorId: number; meta: number }[]) {
    return this.http.put<MetaAsesor[]>(`${API}/metas`, cambios, { params: { periodo } });
  }
}
