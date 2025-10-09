import { Component, Input, OnInit } from '@angular/core';
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
export class MenuComponent implements OnInit {  
  @Input() titulo = 'ARMADA DE COLOMBIA';
  usuario: any = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    //  Suscribirse al observable para actualizar automáticamente el usuario
    this.auth.usuario$.subscribe((user) => {
      this.usuario = user;
    });
  }

  esAdmin(): boolean {
    return this.usuario?.id_rol == 1;
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
