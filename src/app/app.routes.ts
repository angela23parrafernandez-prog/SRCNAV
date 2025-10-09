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
  {
    path: 'usuarios',
    loadComponent: () => import('./paginas/usuarios/usuarios.page').then( m => m.UsuariosPage)
  },
  {
    path: 'usuario',
    loadComponent: () => import('./paginas/usuario/usuario.page').then( m => m.UsuarioPage)
  },
  {
    path: 'francos',
    loadComponent: () => import('./paginas/francos/francos.page').then( m => m.FrancosPage)
  },
  {
    path: 'franco',
    loadComponent: () => import('./paginas/franco/franco.page').then( m => m.FrancoPage)
  },
  {
    path: 'guardia',
    loadComponent: () => import('./paginas/guardia/guardia.page').then( m => m.GuardiaPage)
  },
];
