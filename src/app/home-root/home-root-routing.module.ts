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
                path: 'tabs',
                loadChildren: () => import('../tabs/tabs.module').then( m => m.TabsPageModule)
            },
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
                path: 'symptoms',
                loadChildren: () => import('../pages/symptoms-checker/symptoms-checker.module').then(m => m.SymptomsCheckerPageModule)
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
                path: 'ble-scanner',
                loadChildren: () => import('../pages/ble-scanner/ble-scanner.module').then( m => m.BleScannerPageModule)
            },
            {
                path: 'news',
                loadChildren: () => import('../pages/news/news.module').then( m => m.NewsPageModule)
            },
            {
              path: 'change-password',
              loadChildren: () =>
                  import('../pages/change-password/change-password.module').then(
                      m => m.ChangePasswordPageModule
                  )
            } 
        ]
  },
  {
    path: '',
    redirectTo: '/tabs',
    pathMatch: 'full'
    },
    {
        path: 'tabs',
        loadChildren: () => import('../tabs/tabs.module').then( m => m.TabsPageModule)
    } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRootPageRoutingModule {}
