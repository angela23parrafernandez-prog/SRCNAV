
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FrancosService } from 'src/app/servicios/francos';

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
  grupos: any[] = [];
  loading = true;

  // Filtros
  diaSeleccionado = '';
  mesSeleccionado = '';
  anioSeleccionado = '';
  companiaSeleccionada = '';
  estadoSeleccionado = '';

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

  dias = Array.from({ length: 31 }, (_, i) => i + 1);
  anios = [2024, 2025, 2026];

  ngOnInit() {
    this.cargarFrancos();
  }

  ionViewWillEnter() {
    this.cargarFrancos();
  }

  cargarFrancos() {
    this.francoService.getFrancosActivos().subscribe({
      next: (data) => {
        this.francos = data;
        this.filtrarFrancos();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar francos:', err);
        this.loading = false;
      },
    });
  }

  filtrarFrancos() {
    const filtrados = this.francos.filter((f) => {
      const fecha = new Date(f.fecha_fin);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      const companiaOK =
        !this.companiaSeleccionada ||
        f.usuario?.id_compania === Number(this.companiaSeleccionada);
      const mesOK = !this.mesSeleccionado || mes === Number(this.mesSeleccionado);
      const diaOK = !this.diaSeleccionado || dia === Number(this.diaSeleccionado);
      const anioOK = !this.anioSeleccionado || anio === Number(this.anioSeleccionado);
      const estadoOK = !this.estadoSeleccionado || f.estado === this.estadoSeleccionado;

      return companiaOK && mesOK && diaOK && anioOK && estadoOK;
    });

    this.grupos = this.agruparPorPersona(filtrados);
  }

  agruparPorPersona(francos: any[]) {
    const grupos: any[] = [];
    const mapa = new Map<string, any>();

    francos.forEach((f) => {
      const key = `${f.usuario?.cedula}-${f.usuario?.nombre}-${f.usuario?.apellido}`;
      if (!mapa.has(key)) {
        mapa.set(key, {
          cedula: f.usuario?.cedula,
          nombre: f.usuario?.nombre,
          apellido: f.usuario?.apellido,
          compania: this.getNombreCompania(f.usuario?.id_compania),
          francos: [],
          francoActivo: null,
          abierto: false,
        });
      }
      mapa.get(key).francos.push(f);
      if (f.estado === 'ACTIVO') {
        mapa.get(key).francoActivo = f;
      }
    });

    mapa.forEach((v) => grupos.push(v));
    return grupos;
  }

  toggleGrupo(grupo: any) {
    grupo.abierto = !grupo.abierto;
  }

  getNombreCompania(id: number): string {
    const comp = this.companias.find((c) => c.id_compania === id);
    return comp ? comp.nombre : 'Sin compañía';
  }

  calcularTiempoRestante(fechaFin: string): {
    tipo: 'dias' | 'horas' | 'retraso';
    valor: number;
  } {
    const ahora = new Date();
    const [year, month, day] = fechaFin.split('-').map(Number);
    const fin = new Date(year, month - 1, day, 23, 59, 59);
    const diffMs = fin.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    if (diffMs > 0) {
      if (diffHoras < 24) return { tipo: 'horas', valor: Math.floor(diffHoras) };
      return { tipo: 'dias', valor: Math.ceil(diffDias) };
    }
    return { tipo: 'retraso', valor: Math.abs(Math.ceil(diffDias)) };
  }

    calcularDuracion(fechaInicio: string, fechaFin: string): number {
    const [y1, m1, d1] = fechaInicio.split('-').map(Number);
    const [y2, m2, d2] = fechaFin.split('-').map(Number);
    const inicio = new Date(y1, m1 - 1, d1);
    const fin = new Date(y2, m2 - 1, d2);
    const diffMs = fin.getTime() - inicio.getTime();
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // incluir día inicial
    return diffDias;
  }

   calcularTotalDias(francos: any[]): number {
    let total = 0;
    francos.forEach((f) => {
      if (f.fecha_inicio && f.fecha_fin) {
        total += this.calcularDuracion(f.fecha_inicio, f.fecha_fin);
      }
    });
    return total;
  }


  verDetalle(franco: any) {
    console.log(franco);
    this.router.navigate(['/franco'], {
      state: { francoSeleccionado: franco },
    });
  }

}


