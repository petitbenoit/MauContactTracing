import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BleScannerPage } from './ble-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: BleScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BleScannerPageRoutingModule {}
