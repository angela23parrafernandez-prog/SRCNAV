import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from './general';

@Injectable({
  providedIn: 'root',
})
export class GuardiasService {
  private http = inject(HttpClient);
  private general = inject(GeneralService);

  private API_URL = `${this.general.APIURL}/guardia`;

  getGuardias(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getGuardiaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  createGuardia(data: { nombre: string; compania: string }): Observable<any> {
    return this.http.post<any>(this.API_URL, data);
  }

  updateGuardia(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, data);
  }

  deleteGuardia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
