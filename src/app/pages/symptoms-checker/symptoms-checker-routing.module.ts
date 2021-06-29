import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SymptomsCheckerPage } from './symptoms-checker.page';

const routes: Routes = [
  {
    path: '',
    component: SymptomsCheckerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SymptomsCheckerPageRoutingModule {}
