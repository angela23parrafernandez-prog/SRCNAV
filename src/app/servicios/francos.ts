import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general';

@Injectable({
  providedIn: 'root',
})
export class FrancosService {
  // ✅ Se concatena correctamente el endpoint base
  private readonly API_URL = `${this.generalService.APIURL}/francos`;

  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {}

  /** 🟢 Obtener todos los francos */
  getFrancos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }

  /** 🟡 Obtener francos activos o pendientes (para Sanidad) */
  getFrancosActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/activos`);
  }

  /** 🔵 Obtener un franco específico por ID */
  getFrancoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  /** 🟣 Crear un nuevo franco */
  createFranco(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, data);
  }

  /** 🟠 Actualizar un franco existente */
  updateFranco(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}`, data);
  }

  /** 🔴 Eliminar un franco por ID */
  deleteFranco(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
