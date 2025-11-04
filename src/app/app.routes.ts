import { Routes } from '@angular/router';
import { PanelLayoutComponent } from './componentes/panel-layout/panel-layout.component';

export const routes: Routes = [
  // Página principal sin menú
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full',
  },
  {
    path: 'principal',
    loadComponent: () =>
      import('./paginas/principal/principal.page').then(
        (m) => m.PrincipalPage
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./paginas/login/login.page').then((m) => m.LoginPage),
  },

  // Páginas internas con menú lateral
  {
    path: '',
    component: PanelLayoutComponent, // 👈 layout que incluye el menú
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'lista',
        loadComponent: () =>
          import('./paginas/lista/lista.page').then((m) => m.ListaPage),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./paginas/usuarios/usuarios.page').then(
            (m) => m.UsuariosPage
          ),
      },
      {
        path: 'usuario',
        loadComponent: () =>
          import('./paginas/usuario/usuario.page').then(
            (m) => m.UsuarioPage
          ),
      },
      {
        path: 'francos',
        loadComponent: () =>
          import('./paginas/francos/francos.page').then(
            (m) => m.FrancosPage
          ),
      },
      {
        path: 'franco',
        loadComponent: () =>
          import('./paginas/franco/franco.page').then(
            (m) => m.FrancoPage
          ),
      },
      {
        path: 'crear-usuario',
        loadComponent: () =>
          import('./paginas/crear-usuario/crear-usuario.page').then(
            (m) => m.CrearUsuarioPage
          ),
      },
      {
        path: 'guardia',
        loadComponent: () =>
          import('./paginas/guardia/guardia.page').then(
            (m) => m.GuardiaPage
          ),
      },
    ],
  },

  // Ruta por defecto
  {
    path: '**',
    redirectTo: 'principal',
  },
  {
    path: 'crear-usuario',
    loadComponent: () => import('./paginas/crear-usuario/crear-usuario.page').then( m => m.CrearUsuarioPage)
  },

];
