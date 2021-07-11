import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BleAdminPage } from './ble-admin.page';

const routes: Routes = [
  {
    path: '',
    component: BleAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BleAdminPageRoutingModule {}
