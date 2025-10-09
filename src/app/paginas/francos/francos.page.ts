import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FrancosService } from 'src/app/servicios/francos';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-francos',
  templateUrl: './francos.page.html',
  styleUrls: ['./francos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class FrancosPage implements OnInit {
  private francoService = inject(FrancosService);
  private router = inject(Router);

  francos: any[] = [];
  loading = true;
  companias = [
    { id_compania: 1, nombre: 'Henao' },
    { id_compania: 2, nombre: 'Acevedo' },
    { id_compania: 3, nombre: 'Hayes' },
    { id_compania: 4, nombre: 'Valverde' },
    { id_compania: 5, nombre: 'BGD' },
  ];
  ngOnInit() {
    this.cargarFrancos();
  }
  ionViewWillEnter() {
    this.cargarFrancos();
  }
  /** 🔹 Cargar francos activos o pendientes */
  cargarFrancos() {
    this.francoService.getFrancosActivos().subscribe({
      next: (data) => {
        this.francos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar sanidad:', err);
        this.loading = false;
      },
    });
  }

  /** 🔹 Ir al detalle del usuario seleccionado */
  verDetalle(franco: any) {
    console.log(franco);
    this.router.navigate(['/franco'], {
      state: { francoSeleccionado: franco },
    });
  }
  calcularTiempoRestante(fechaFin: string): {
    tipo: 'dias' | 'horas' | 'retraso';
    valor: number;
  } {
    const ahora = new Date();

    // 🕓 Parseo correcto en zona local (evita desfase UTC)
    const [year, month, day] = fechaFin.split('-').map(Number);
    const fin = new Date(year, month - 1, day, 23, 59, 59); // último segundo del día

    const diferenciaMs = fin.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

    if (diferenciaMs > 0) {
      if (diferenciaHoras < 24) {
        return { tipo: 'horas', valor: Math.floor(diferenciaHoras) };
      } else {
        return { tipo: 'dias', valor: Math.ceil(diferenciaDias) };
      }
    } else {
      // ⏰ Ya pasó la fecha → días de retraso
      return { tipo: 'retraso', valor: Math.abs(Math.ceil(diferenciaDias)) };
    }
  }

  getNombreCompania(id: number): string {
    const comp = this.companias.find((c) => c.id_compania === id);
    return comp ? comp.nombre : 'Sin compañía';
  }
}
