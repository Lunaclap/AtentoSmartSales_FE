export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string; // 'DNI', 'RUC', 'CE'
  numeroDocumento: string;
  role: string;          // 'ROLE_ADMIN', 'ROLE_ASESOR', etc.
  activo: boolean;
}