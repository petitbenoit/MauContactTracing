import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGuard } from '../guards/home.guard';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminPage,
    canActivate: [HomeGuard],
    children: [
        {
            path: 'tabs',
            loadChildren: () =>
                import('../tabs/tabs.module').then(m => m.TabsPageModule)
        },
        {
            path: 'ble-admin',
            loadChildren: () =>
                import('../pages/ble-admin/ble-admin.module').then(m => m.BleAdminPageModule)
        },
        {
            path: 'ble-scanner',
            loadChildren: () =>
                import('../pages/ble-scanner/ble-scanner.module').then(m => m.BleScannerPageModule)
        },
        {
          path: 'manage-user',
          loadChildren: () =>
              import('../pages/manage-user/manage-user.module').then(m => m.ManageUserPageModule)
        },
        {
            path: '',
            redirectTo: 'admin/ble-admin',
            pathMatch: 'full'
        } 
    ]
  },
  {
    path: '',
    redirectTo: 'admin/ble-admin',
    pathMatch: 'full'
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
