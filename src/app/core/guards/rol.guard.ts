import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { esGerente, rolActual } from '../services/comercial.service';

/** Vistas del gerente (también las ve el administrador). Al asesor lo lleva a su reporte. */
export const gerenteGuard: CanActivateFn = () =>
  esGerente() ? true : inject(Router).parseUrl('/mi-reporte');

/** Vistas propias del asesor. */
export const asesorGuard: CanActivateFn = () =>
  rolActual() === 'ROLE_ASESOR' ? true : inject(Router).parseUrl('/dashboard');

/** Página de inicio según el rol. */
export const inicioPorRol = () => (esGerente() ? 'dashboard' : 'mi-reporte');
