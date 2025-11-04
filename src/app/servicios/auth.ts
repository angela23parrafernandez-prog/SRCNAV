import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'mi-clave-super-secreta';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public API_URL: string = 'http://localhost:3000';
  

  private usuarioSubject = new BehaviorSubject<any>(this.getUsuario());
  usuario$ = this.usuarioSubject.asObservable();
  constructor(private http: HttpClient) {}

  /** Iniciar sesión con cédula y contraseña */
  login(cedula: string, contrasena: string): Observable<any> {
    return this.http
      .post(`${this.API_URL}/auth/login`, { cedula, contrasena })
      .pipe(
        tap((response: any) => {
          console.log(response);

          if (response?.token) {
            localStorage.setItem('token', response.token);

            //  Cifrado correcto
            const encrypted = CryptoJS.AES.encrypt(
              JSON.stringify(response.usuario),
              SECRET_KEY
            ).toString();

            console.log('Encrypted usuario:', encrypted); // Debug

            localStorage.setItem('usuario', encrypted);
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  /** Obtener usuario desencriptado */
  getUsuario(): any {
    const encrypted = localStorage.getItem('usuario');
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error al desencriptar usuario:', error);
      return null;
    }
  }

  /** Obtener token almacenado */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Cerrar sesión */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  /** Saber si hay sesión activa */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
