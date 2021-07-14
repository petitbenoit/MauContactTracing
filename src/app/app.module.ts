import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BLE } from '@ionic-native/ble/ngx';

import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Device } from '@ionic-native/device/ngx';

import { FormsModule } from '@angular/forms';

// Firebase 
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Environment 
import { environment } from 'src/environments/environment.prod';

// Auth Service
import { AuthenticationService } from './services/authentication.service';

// Auth Guard
import { AuthGuard } from './guards/auth.guard';

// API service
import { ApiService } from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";

import { BackgroundMode } from '@ionic-native/background-mode/ngx';
// import { SplashScreen } from "@ionic-native/splash-screen/ngx";
// import { StatusBar } from "@ionic-native/status-bar/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FilterPipe } from './pipes/filter.pipe';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@NgModule({
  declarations: [AppComponent, FilterPipe],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
  ],
  providers: [
    BackgroundMode,
    InAppBrowser,
    ApiService,
    AuthenticationService,
    AuthGuard,
    Device,
    AndroidPermissions,
    LocationAccuracy,
    BluetoothLE,
    BLE, 
    AppMinimize,
    // StatusBar,
    // SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
