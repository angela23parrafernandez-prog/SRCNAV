import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from '../servicios/general';
import { Auth } from '../servicios/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    RouterModule, // ✅ necesario para routerLink
    IonicModule, // ✅ IMPORTANTE: aquí está la clave
  ],
})
export class HomePage {
  usuario: any = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuario = this.auth.getUsuario();
  }

  /** Verifica si es administrador */
  esAdmin(): boolean {
    return this.usuario?.id_rol == 1;
  }
}
