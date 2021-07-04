import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
    import('./index/index.module').then(m => m.IndexPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./home-root/home-root.module').then(m => m.HomeRootPageModule)
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./pages/intro/intro.module').then(
        m => m.IntroPageModule
      )
  },
  {
    path: 'symptoms-input',
    loadChildren: () => import('./pages/symptoms-input/symptoms-input.module').then( m => m.SymptomsInputPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
