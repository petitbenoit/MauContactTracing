import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SymptomsCheckerPageRoutingModule } from './symptoms-checker-routing.module';

import { SymptomsCheckerPage } from './symptoms-checker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SymptomsCheckerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SymptomsCheckerPage]
})
export class SymptomsCheckerPageModule {}
