import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  IonText,
  IonIcon,
  IonSpinner,  
  ToastController,
} from '@ionic/angular/standalone';
import { UsuariosService } from 'src/app/servicios/usuarios';
import { addCircleOutline, personCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonList,
    IonText,
    IonIcon,
    IonSpinner, 
    CommonModule,
    FormsModule,
  ],
})
export class CrearUsuarioPage implements OnInit {
  usuario = {
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    contrasena: '',
    id_rol: null,
  };

  rolesDisponibles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Normal' },
    { id: 3, nombre: 'General' },
  ];

  rolesInfo: any = {
  1: { nombre: 'Administrador', descripcion: 'Acceso total al sistema, puede gestionar usuarios y registros.' },
  2: { nombre: 'Usuario', descripcion: 'Acceso a funciones operativas, puede registrar y consultar datos.' },
  3: { nombre: 'General', descripcion: 'Rol con acceso limitado, solo visualiza información básica.' },
};


  usuarios: any[] = [];
  mostrandoFormulario = false;
  cargando = false;

  constructor(
    private usuariosService: UsuariosService,
    private toastController: ToastController
  ) {
    addIcons({ addCircleOutline, personCircleOutline });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  /** Mostrar / ocultar el formulario */
  toggleFormulario() {
    this.mostrandoFormulario = !this.mostrandoFormulario;
  }

  /** Cargar usuarios con credenciales */
  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.getUsuariosConCredenciales().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.mostrarToast('Error al obtener los usuarios');
        this.cargando = false;
      },
    });
  }

  /** Crear usuario */
  async crearUsuario() {
    if (
      !this.usuario.cedula ||
      !this.usuario.nombre ||
      !this.usuario.apellido ||
      !this.usuario.correo ||
      !this.usuario.contrasena ||
      !this.usuario.id_rol
    ) {
      this.mostrarToast('Completa todos los campos obligatorios.');
      return;
    }

    this.usuariosService.createUsuario(this.usuario).subscribe({
      next: async () => {
        this.mostrarToast(' Usuario creado exitosamente.');
        this.usuario = {
          cedula: '',
          nombre: '',
          apellido: '',
          telefono: '',
          correo: '',
          contrasena: '',
          id_rol: null,
        };
        this.mostrandoFormulario = false;
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.mostrarToast(
          err.error?.message || ' Error al crear el usuario.'
        );
      },
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
    });
    toast.present();
  }
}
