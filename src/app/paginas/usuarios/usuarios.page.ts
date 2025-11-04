import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsuariosService } from 'src/app/servicios/usuarios';
import { Router, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    { id_especialidad: 1, descripcion: 'Naviera' },
    { id_especialidad: 2, descripcion: 'Oceanografía Física' },
  ];
  secciones = [
    { id_seccion: 1, descripcion: 'Primera' },
    { id_seccion: 2, descripcion: 'Segunda' },
    { id_seccion: 3, descripcion: 'Tercera' },
  ];
  companias = [
    { id_compania: 1, nombre: 'Henao' },
    { id_compania: 4, nombre: 'Acevedo' },
    { id_compania: 3, nombre: 'Hayes' },
  
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


  exportarExcel() {
  // Si hay filtros activos, exporta los filtrados; si no, todos
  const datosExportar =
    this.usuariosFiltrados.length > 0 ? this.usuariosFiltrados : this.usuarios;

  if (datosExportar.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  // 🔄 Transformar datos en formato plano
  const filas: any[] = [];
  datosExportar.forEach((u) => {
    filas.push({
      Cédula: u.cedula,
      Nombre: `${u.nombre} ${u.apellido}`,
      Compañía: this.obtenerCompania(u.id_compania),
      Grado: this.obtenerDescripcion(this.grados, u.id_grado),
      Especialidad: this.obtenerDescripcion(this.especialidades, u.id_especialidad),
      Sección: this.obtenerDescripcion(this.secciones, u.id_seccion),
    });
  });

  // 🧾 Crear hoja y libro Excel
  const hoja = XLSX.utils.json_to_sheet(filas);

  // Ajustar ancho automático de columnas
  const maxLengths = Object.keys(filas[0]).map((key) =>
    Math.max(key.length, ...filas.map((row) => (row[key] ? row[key].toString().length : 0)))
  );
  hoja['!cols'] = maxLengths.map((w) => ({ wch: w + 2 }));

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');

  // 📁 Nombre dinámico
  const nombreArchivo = this.obtenerNombreArchivo();

  // 💾 Guardar
  const buffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, nombreArchivo);
}

private obtenerNombreArchivo(): string {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();

  let nombre = `usuarios_${anio}-${mes}-${dia}`;
  const filtros = [];

  if (this.filtros.nombre) filtros.push(`nombre-${this.filtros.nombre}`);
  if (this.filtros.apellido) filtros.push(`apellido-${this.filtros.apellido}`);
  if (this.filtros.cedula) filtros.push(`cedula-${this.filtros.cedula}`);
  if (this.filtros.id_compania) filtros.push(`comp${this.filtros.id_compania}`);
  if (this.filtros.id_grado) filtros.push(`grado${this.filtros.id_grado}`);
  if (this.filtros.id_especialidad) filtros.push(`esp${this.filtros.id_especialidad}`);
  if (this.filtros.id_seccion) filtros.push(`sec${this.filtros.id_seccion}`);

  if (filtros.length > 0) nombre += '_' + filtros.join('_');
  return `${nombre}.xlsx`;
}

}
