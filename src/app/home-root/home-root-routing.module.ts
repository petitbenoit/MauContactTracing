import { AuthGuard } from './../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeRootPage } from './home-root.page';
import { HomeGuard } from '../guards/home.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeRootPage,
    canActivate: [HomeGuard],
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('../pages/home/home.module').then(m => m.HomePageModule)
            },
            {
                path: 'map',
                loadChildren: () =>
                    import('../pages/map/map.module').then(m => m.MapPageModule)
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('../pages/profile/profile.module').then(
                        m => m.ProfilePageModule
                    )
            },
            {
              path: 'change-password',
              loadChildren: () =>
                  import('../pages/change-password/change-password.module').then(
                      m => m.ChangePasswordPageModule
                  )
            },  
            {
              path: 'profile',
              loadChildren: () =>
                  import('../pages/profile/profile.module').then(
                      m => m.ProfilePageModule
                  )
            },  
            {
              path: 'profile/edit',
              loadChildren: () =>
                  import('../pages/profile-edit/profile-edit.module').then(
                      m => m.ProfileEditPageModule
                  )
            },                
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            }
        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRootPageRoutingModule {}
