import { Component, Injectable, OnInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.page.html',
  styleUrls: ['./home-root.page.scss'],
})
export class HomeRootPage implements OnInit {

  constructor(
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private backgroundMode: BackgroundMode,
    private appMinimize: AppMinimize
  ) { 
    //this.backgroundMode.enable();
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
       App.exitApp();
       
        //this.appMinimize.minimize();
      }
    });
  }

  ngOnInit() {
  }

}
