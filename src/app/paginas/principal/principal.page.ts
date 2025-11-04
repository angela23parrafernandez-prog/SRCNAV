import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,

  IonCardTitle,
  IonCardContent,
  IonIcon, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonImg, 
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class PrincipalPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  //  Redirige al módulo Sanidad
  irSanidad() {
    this.router.navigateByUrl('/login');
  }

  //  Redirige al módulo Seguridad
  irSeguridad() {
   
  }

  //  Redirige al módulo Energía
  irEnergia() {
   
  }
}

