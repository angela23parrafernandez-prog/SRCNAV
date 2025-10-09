import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Auth } from 'src/app/servicios/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() titulo = 'ARMADA DE COLOMBIA';
  usuario: any = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.usuario = this.auth.getUsuario();
    this.esAdmin();
  }

  esAdmin(): boolean {
    return this.usuario?.id_rol == 1;
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
