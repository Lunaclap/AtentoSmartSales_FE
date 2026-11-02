import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('userRole') || ''; // O puedes decodificarlo del token si guardas el rol

  // Verificamos si el rol almacenado es administrador
  if (userRole === 'ROLE_ADMIN') {
    return true;
  } else {
    alert('Acceso denegado. Este módulo es exclusivo para administradores.');
    router.navigate(['/dashboard']);
    return false;
  }
};