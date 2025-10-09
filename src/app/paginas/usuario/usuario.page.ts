import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsuarioPage implements OnInit {
  roles = [
    { id_rol: 1, descripcion: 'admin' },
    { id_rol: 2, descripcion: 'usuario' },
  ];

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

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private generalService = inject(GeneralService);

  usuario: any = null;
  loading = false;
  isEdit = false;

  form: FormGroup<any> = this.fb.group({
    cedula: ['', [Validators.required, Validators.minLength(10)]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: [''],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    id_rol: [null, Validators.required],
    id_grado: [null, Validators.required],
    id_especialidad: [null, Validators.required],
    id_seccion: [null, Validators.required],
    id_compania: [null, Validators.required],
    estado: [true],
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras?.state?.['usuario'];

    if (this.usuario) {
      this.isEdit = true;

      // Quitar campo de contraseña si es edición
      this.form.removeControl('contrasena');

      // Rellenar formulario con los datos del usuario
      this.form.patchValue({
        cedula: this.usuario.cedula,
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        telefono: this.usuario.telefono,
        correo: this.usuario.correo,
        id_rol: this.usuario.id_rol,
        id_grado: this.usuario.id_grado,
        id_especialidad: this.usuario.id_especialidad,
        id_seccion: this.usuario.id_seccion,
        id_compania: this.usuario.id_compania, // ✅ nuevo campo
        estado: this.usuario.estado ?? true,
      });
    } else {
      this.isEdit = false;
    }
  }

  guardar() {
    if (this.form.invalid) return;

    this.loading = true;
    const data = this.form.value;

    // Determinar si es edición o creación
    const request$ = this.isEdit
      ? this.usuariosService.updateUsuario(this.usuario.cedula, data)
      : this.usuariosService.createUsuario(data);

    request$.subscribe({
      next: async () => {
        this.loading = false;
        const successMessage = this.isEdit
          ? 'Usuario actualizado correctamente ✅'
          : 'Usuario creado correctamente ✅';

        await this.generalService.showSuccess(successMessage);
        this.router.navigate(['/usuarios']);
      },
      error: async (err) => {
        this.loading = false;
        console.error(err);
        await this.generalService.showError('Error al guardar usuario ❌');
      },
    });
  }
}
