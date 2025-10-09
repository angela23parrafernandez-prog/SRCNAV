import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general';
import { FrancosService } from 'src/app/servicios/francos';

@Component({
  selector: 'app-franco',
  templateUrl: './franco.page.html',
  styleUrls: ['./franco.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, FormsModule],
})
export class FrancoPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private generalService = inject(GeneralService);
  private francosService = inject(FrancosService);

  form!: FormGroup;
  sanidad: any = null;
  isEdit = false;
  loading = false;

  razones = [
    { id_razon: 1, descripcion: 'PERMISO MÉDICO' },
    { id_razon: 2, descripcion: 'EXCUSADO DE SERVICIO' },
    { id_razon: 3, descripcion: 'REPOSO MÉDICO' },
  ];

  estados = ['PENDIENTE', 'ACTIVO', 'FINALIZADO', 'CANCELADO'];

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.sanidad = nav?.extras?.state?.['francoSeleccionado'];

    const hoy = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    this.form = this.fb.group({
      cedula: ['', Validators.required],
      nombre: [''],
      apellido: [''],
      id_razon: [null], // 🔹 razón no requerida al inicio
      fecha_inicio: [hoy, Validators.required],
      fecha_fin: [hoy, Validators.required],
      observacion: [''],
      estado: ['PENDIENTE', Validators.required],
    });

    if (this.sanidad) {
      this.isEdit = true;
      this.form.patchValue({
        cedula: this.sanidad.usuario?.cedula,
        nombre: this.sanidad.usuario?.nombre,
        apellido: this.sanidad.usuario?.apellido,
        id_razon: this.sanidad.razon?.id_razon,
        fecha_inicio: this.sanidad.fecha_inicio,
        fecha_fin: this.sanidad.fecha_fin,
        observacion: this.sanidad.observacion,
        estado: this.sanidad.estado,
      });
      this.form.get('cedula')?.disable();
    }
  }

  /** 🔹 Cambiar comportamiento según estado */
  onEstadoChange(event: any) {
    const nuevoEstado = event.detail.value;

    if (nuevoEstado === 'ACTIVO') {
      // Si pasa a activo → habilitar razón y limpiar fechas para definirlas
      this.form.get('id_razon')?.setValidators(Validators.required);
      this.form.get('id_razon')?.updateValueAndValidity();

      this.form.patchValue({
        fecha_inicio: '',
        fecha_fin: '',
      });
    } else {
      // Si vuelve a pendiente o cancela → limpiar razón
      this.form.get('id_razon')?.clearValidators();
      this.form.patchValue({
        id_razon: null,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date().toISOString().split('T')[0],
      });
      this.form.get('id_razon')?.updateValueAndValidity();
    }
  }

  /** Guardar o actualizar sanidad */
  guardar() {
    if (this.form.invalid) {
      this.generalService.showError('Completa los campos obligatorios');
      return;
    }

    this.loading = true;
    const data = this.form.getRawValue();

    const payload = {
      cedula_usuario: data.cedula,
      id_razon: data.id_razon,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      observacion: data.observacion,
      estado: data.estado,
    };

    const request$ = this.isEdit
      ? this.francosService.updateFranco(this.sanidad.id_franco, payload)
      : this.francosService.createFranco(payload);

    request$.subscribe({
      next: async () => {
        this.loading = false;
        const msg = this.isEdit
          ? 'Registro de sanidad actualizado ✅'
          : 'Registro de sanidad creado ✅';
        await this.generalService.showSuccess(msg);
        this.router.navigate(['/francos']);
      },
      error: async (err) => {
        this.loading = false;
        console.error(err);
        await this.generalService.showError('Error al guardar registro ❌');
      },
    });
  }
}
