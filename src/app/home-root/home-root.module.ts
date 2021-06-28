import { TabsPageRoutingModule } from './../tabs/tabs-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeRootPageRoutingModule } from './home-root-routing.module';

import { HomeRootPage } from './home-root.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRootPageRoutingModule,
    //TabsPageRoutingModule
  ],
  declarations: [HomeRootPage]
})
export class HomeRootPageModule {}
