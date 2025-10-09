import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private API_URL = this.generalService.APIURL + '/usuarios';
  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {}

  /** Obtener todos los usuarios normales (rol 2) */
  getAllUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }

  /** Obtener detalle de un usuario por cédula */
  getUsuarioByCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${cedula}`);
  }
  updateUsuario(cedula: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${cedula}`, data);
  }
  createUsuario(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }
}
