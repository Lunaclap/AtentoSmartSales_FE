// URL base del backend.
// En tu computadora (localhost) usa el backend local; en cualquier otro dominio usa el backend en Render.
export const API_BASE_URL =
  typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://atentosmartsales-be.onrender.com';
