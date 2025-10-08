import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { env } from '../env';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = env + 'auth';

  constructor(private http: HttpClient) {}

  /** Iniciar sesión con cédula y contraseña */
  login(cedula: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { cedula, contrasena }).pipe(
      tap((response: any) => {
        // Guardamos el token en localStorage
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  /** Obtener token almacenado */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Cerrar sesión */
  logout() {
    localStorage.removeItem('token');
  }

  /** Saber si hay sesión activa */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
