import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonNote,
  IonText,
  IonLabel,
  IonFooter,
  ToastController,
  LoadingController,
  NavController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Auth } from 'src/app/servicios/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // 👇 Agrega todos los componentes que usas en el HTML
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonItem,
    IonNote,
    IonText,
    IonLabel,
    IonFooter,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  loginForm: FormGroup = this.fb.group({
    cedula: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    contrasena: ['', [Validators.required]],
  });

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    toast.present();
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.showToast('Por favor complete todos los campos correctamente');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    const { cedula, contrasena } = this.loginForm.value;

    this.authService.login(cedula, contrasena).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.showToast('Inicio de sesión exitoso', 'success');
        this.navCtrl.navigateRoot('/home');
      },
      error: async (err) => {
        await loading.dismiss();
        const msg =
          err.error?.message || 'Credenciales inválidas o error de conexión';
        this.showToast(msg, 'danger');
      },
    });
  }
}
