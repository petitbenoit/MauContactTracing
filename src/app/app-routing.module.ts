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
    path: 'dashboard',
    loadChildren: () =>
        import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
      path: 'map',
      loadChildren: () =>
          import('./pages/map/map.module').then(m => m.MapPageModule)
  },
  {
      path: 'symptoms',
      loadChildren: () => import('./pages/symptoms-checker/symptoms-checker.module').then(m => m.SymptomsCheckerPageModule)
  }, 
  {
      path: 'profile',
      loadChildren: () =>
        import('./pages/profile/profile.module').then(
            m => m.ProfilePageModule
        )
  },  
  {
      path: 'profile/edit',
      loadChildren: () =>
        import('./pages/profile-edit/profile-edit.module').then(
            m => m.ProfileEditPageModule
        )
  },   
  {
    path: 'symptoms-input',
    loadChildren: () => import('./pages/symptoms-input/symptoms-input.module').then( m => m.SymptomsInputPageModule)
  },  {
    path: 'ble-admin',
    loadChildren: () => import('./pages/ble-admin/ble-admin.module').then( m => m.BleAdminPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./pages/checkin/checkin.module').then( m => m.CheckinPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
