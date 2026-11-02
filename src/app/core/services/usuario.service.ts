import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // <--- Añadir estos dos métodos que faltaban en el servicio:
  deshabilitarUsuario(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/deshabilitar`, {});
  }

  activarUsuario(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/activar`, {});
  }
}