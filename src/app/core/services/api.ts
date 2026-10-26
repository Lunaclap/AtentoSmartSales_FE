import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';

  getTestMessage(): Observable<string> {
    // Apuntamos al endpoint público de tu controlador
    return this.http.get(`${this.baseUrl}/public/saludo`, { responseType: 'text' });
  }
}