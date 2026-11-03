import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SesionService } from '../services/sesion.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const sesion = inject(SesionService);
  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((e: unknown) => {
      // 401 = el backend ya no acepta el token (vencido o el servidor se reinició): se cierra la sesión con aviso.
      // El login queda fuera porque ahí un 401 significa credenciales incorrectas.
      if (e instanceof HttpErrorResponse && e.status === 401 && token && !req.url.includes('/api/auth/')) {
        sesion.expirar();
      }
      return throwError(() => e);
    })
  );
};
