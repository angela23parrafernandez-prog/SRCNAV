import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  public APIURL = 'http://localhost:3001';
  constructor(private toastCtrl: ToastController) {}

  async showSuccess(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });
    toast.present();
  }

  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color: 'danger',
      position: 'bottom',
    });
    toast.present();
  }
}
