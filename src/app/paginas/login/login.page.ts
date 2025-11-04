import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
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

  ToastController,
  LoadingController,
  NavController, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Auth } from 'src/app/servicios/auth';
import { GeneralService } from 'src/app/servicios/general';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonImg, 
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonNote,
    IonText,
    IonLabel,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private generalService = inject(GeneralService);

  loginForm: FormGroup = this.fb.group({
    cedula: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    contrasena: ['', [Validators.required]],
  });

  async onLogin() {
    if (this.loginForm.invalid) {
      this.generalService.showError(
        'Por favor complete todos los campos correctamente'
      );
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
        this.generalService.showSuccess('Inicio de sesión exitoso');
        this.navCtrl.navigateRoot('/home');
      },
      error: async (err) => {
        await loading.dismiss();
        const msg =
          err.error?.message || 'Credenciales inválidas o error de conexión';
        this.generalService.showError(msg);
      },
    });
  }
}
