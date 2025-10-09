import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FrancosService } from 'src/app/servicios/francos';
import { Router, RouterLink } from '@angular/router';
import { MenuComponent } from 'src/app/componentes/menu/menu.component';

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
  francosFiltrados: any[] = [];
  francos: any[] = [];
  loading = true;
  mesSeleccionado = '';
  companiaSeleccionada = '';
  companias = [
    { id_compania: 1, nombre: 'Henao' },
    { id_compania: 4, nombre: 'Acevedo' },
    { id_compania: 3, nombre: 'Hayes' },
 
    { id_compania: 5, nombre: 'BGD' },
  ];

  meses = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 },
  ];

  
  ngOnInit() {
    this.cargarFrancos();
  }
  ionViewWillEnter() {
    this.cargarFrancos();
  }
  /** Cargar francos activos o pendientes */
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

  /**  Ir al detalle del usuario seleccionado */
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

    //  Parseo correcto en zona local (evita desfase UTC)
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
      //  Ya pasó la fecha → días de retraso
      return { tipo: 'retraso', valor: Math.abs(Math.ceil(diferenciaDias)) };
    }
  }

  getNombreCompania(id: number): string {
    const comp = this.companias.find((c) => c.id_compania === id);
    return comp ? comp.nombre : 'Sin compañía';
  }


   filtrarFrancos() {
    this.francosFiltrados = this.francos.filter((f) => {
      const fecha = new Date(f.fecha_fin);
      const mes = fecha.getMonth() + 1; // enero = 1
      const companiaOK =
        !this.companiaSeleccionada ||
        f.usuario?.id_compania === Number(this.companiaSeleccionada);
      const mesOK = !this.mesSeleccionado || mes === Number(this.mesSeleccionado);
      return companiaOK && mesOK;
    });
  }
}
