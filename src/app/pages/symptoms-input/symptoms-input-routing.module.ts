import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SymptomsInputPage } from './symptoms-input.page';

const routes: Routes = [
  {
    path: '',
    component: SymptomsInputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SymptomsInputPageRoutingModule {}
