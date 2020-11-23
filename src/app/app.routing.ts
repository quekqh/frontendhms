import { Routes, RouterModule } from '@angular/router';
// Set the routing files
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
];
export const routing = RouterModule.forRoot(routes);
