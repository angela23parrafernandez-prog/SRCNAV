import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuardiasService } from 'src/app/servicios/guardias';
import { GeneralService } from 'src/app/servicios/general';

@Component({
  selector: 'app-guardia',
  templateUrl: './guardia.page.html',
  styleUrls: ['./guardia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GuardiaPage implements OnInit {
  private guardiasService = inject(GuardiasService);
  private generalService = inject(GeneralService);

  guardias: any[] = [];
  companias = [
    { id: 1, nombre: 'Henao' },
    { id: 2, nombre: 'Acevedo' },
    { id: 3, nombre: 'Hayes' },
    { id: 4, nombre: 'Valverde' },
    { id: 5, nombre: 'BGD' },
  ];

  nombre = '';
  compania = '';
  puedeMarcar = true;
  horasRestantes = 0;

  ngOnInit() {
    this.cargarGuardias();
  }

  /** 🔹 Cargar guardias desde el backend */
  cargarGuardias() {
    this.guardiasService.getGuardias().subscribe({
      next: (data) => {
        // Ordenamos de más reciente a más antigua
        this.guardias = data.sort(
          (a, b) =>
            new Date(b.hora_registro).getTime() -
            new Date(a.hora_registro).getTime()
        );
        this.verificarUltimaGuardia();
      },
      error: (err) => {
        console.error(err);
        this.generalService.showError('Error al cargar guardias');
      },
    });
  }

  /** 🔹 Verifica si ya pasaron 24h desde la última guardia */
  verificarUltimaGuardia() {
    if (this.guardias.length === 0) {
      this.puedeMarcar = true;
      this.horasRestantes = 0;
      return;
    }

    const ultima = new Date(this.guardias[0].hora_registro);
    const ahora = new Date();
    const diffMs = ahora.getTime() - ultima.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras >= 24) {
      this.puedeMarcar = true;
      this.horasRestantes = 0;
    } else {
      this.puedeMarcar = false;
      this.horasRestantes = Math.ceil(24 - diffHoras);
    }
  }

  /** 🔹 Registrar nueva guardia */
  registrarGuardia() {
    if (!this.nombre || !this.compania) {
      this.generalService.showError('Completa todos los campos');
      return;
    }

    if (!this.puedeMarcar) {
      this.generalService.showError(
        `No puedes marcar todavía. Faltan ${this.horasRestantes} horas.`
      );
      return;
    }

    // ⚡ Capturamos la hora local del cliente en formato ISO (compatible con MySQL DATETIME)
    // Capturar hora local y ajustar manualmente a UTC-5
    const horaActual = new Date();
    const horaLocal = new Date(horaActual.getTime() - 5 * 60 * 60 * 1000);
    const horaISO = horaLocal.toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      nombre: this.nombre,
      compania: this.compania,
      hora_registro: horaISO, // ⏰ Se envía al backend
    };

    this.guardiasService.createGuardia(payload).subscribe({
      next: async () => {
        await this.generalService.showSuccess(
          'Guardia registrada correctamente ✅'
        );
        this.nombre = '';
        this.compania = '';
        this.cargarGuardias();
      },
      error: (err) => {
        console.error(err);
        this.generalService.showError('Error al registrar guardia ❌');
      },
    });
  }
}
