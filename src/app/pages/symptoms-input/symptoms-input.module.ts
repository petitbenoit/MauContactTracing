import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SymptomsInputPageRoutingModule } from './symptoms-input-routing.module';

import { SymptomsInputPage } from './symptoms-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SymptomsInputPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SymptomsInputPage]
})
export class SymptomsInputPageModule {}
