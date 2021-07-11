import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleAdminPageRoutingModule } from './ble-admin-routing.module';

import { BleAdminPage } from './ble-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleAdminPageRoutingModule
  ],
  declarations: [BleAdminPage]
})
export class BleAdminPageModule {}
