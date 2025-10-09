import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, MenuComponent],
  templateUrl: './panel-layout.component.html',
  styleUrls: ['./panel-layout.component.scss'],
})
export class PanelLayoutComponent {}
