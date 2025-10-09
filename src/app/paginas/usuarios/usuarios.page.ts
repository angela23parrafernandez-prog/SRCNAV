import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsuariosService } from 'src/app/servicios/usuarios';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class UsuariosPage implements OnInit {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  loading = true;

  mostrarModal = false;

  filtros = {
    nombre: '',
    apellido: '',
    cedula: '',
    id_grado: null,
    id_especialidad: null,
    id_seccion: null,
    id_compania: null,
  };

  grados = [
    { id_grado: 1, descripcion: 'GN1' },
    { id_grado: 2, descripcion: 'GN2' },
  ];
  especialidades = [
    { id_especialidad: 1, descripcion: 'Meteorología' },
    { id_especialidad: 2, descripcion: 'Oceanografía Física' },
  ];
  secciones = [
    { id_seccion: 1, descripcion: 'Primera' },
    { id_seccion: 2, descripcion: 'Segunda' },
    { id_seccion: 3, descripcion: 'Tercera' },
  ];
  companias = [
    { id_compania: 1, nombre: 'Henao' },
    { id_compania: 2, nombre: 'Acevedo' },
    { id_compania: 3, nombre: 'Hayes' },
    { id_compania: 4, nombre: 'Valverde' },
    { id_compania: 5, nombre: 'BGD' },
  ];

  ngOnInit() {
    this.cargarUsuarios();
  }

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getAllUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.usuariosFiltrados = [...this.usuarios];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.loading = false;
      },
    });
  }

  abrirModalFiltros() {
    this.mostrarModal = true;
  }

  cerrarModalFiltros() {
    this.mostrarModal = false;
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter((u) => {
      const matchNombre = u.nombre
        .toLowerCase()
        .includes(this.filtros.nombre.toLowerCase());
      const matchApellido = u.apellido
        .toLowerCase()
        .includes(this.filtros.apellido.toLowerCase());
      const matchCedula = u.cedula
        .toLowerCase()
        .includes(this.filtros.cedula.toLowerCase());
      const matchGrado =
        !this.filtros.id_grado || u.id_grado === this.filtros.id_grado;
      const matchEspecialidad =
        !this.filtros.id_especialidad ||
        u.id_especialidad === this.filtros.id_especialidad;
      const matchSeccion =
        !this.filtros.id_seccion || u.id_seccion === this.filtros.id_seccion;
      const matchCompania =
        !this.filtros.id_compania || u.id_compania === this.filtros.id_compania;

      return (
        matchNombre &&
        matchApellido &&
        matchCedula &&
        matchGrado &&
        matchEspecialidad &&
        matchSeccion &&
        matchCompania
      );
    });

    this.cerrarModalFiltros();
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      apellido: '',
      cedula: '',
      id_grado: null,
      id_especialidad: null,
      id_seccion: null,
      id_compania: null,
    };
    this.cerrarModalFiltros();
  }

  verUsuario(usuario: any) {
    this.router.navigate(['/usuario'], { state: { usuario } });
  }

  obtenerDescripcion(lista: any[], id: number) {
    return lista.find((x) => Object.values(x)[0] === id)?.descripcion || '-';
  }

  obtenerCompania(id: number) {
    return this.companias.find((c) => c.id_compania === id)?.nombre || '-';
  }
}
