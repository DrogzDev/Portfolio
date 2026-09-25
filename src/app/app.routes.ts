import {
  Routes
} from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/home/home'
      ).then(
        (component) =>
          component.HomeComponent
      )
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import(
        './pages/project-detail/project-detail'
      ).then(
        (component) =>
          component.ProjectDetailComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];