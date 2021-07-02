import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleScannerPageRoutingModule } from './ble-scanner-routing.module';

import { BleScannerPage } from './ble-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleScannerPageRoutingModule
  ],
  declarations: [BleScannerPage]
})
export class BleScannerPageModule {}
