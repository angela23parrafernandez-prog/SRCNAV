import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from '../servicios/general';
import { Auth } from '../servicios/auth';
import { MenuComponent } from '../componentes/menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonicModule,


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
