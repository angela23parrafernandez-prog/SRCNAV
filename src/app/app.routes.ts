import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./paginas/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'lista',
    loadComponent: () => import('./paginas/lista/lista.page').then( m => m.ListaPage)
  },
];
