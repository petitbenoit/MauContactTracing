import { Component, NgZone, OnInit } from '@angular/core';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AlertController, ToastController } from '@ionic/angular';

import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  credentials: FormGroup;

  constructor(
    private auth: AuthenticationService,
    private toastr: ToastController,
    private router: Router,
    private fb: FormBuilder
    ) { 
    /*   this.ble.enable();
      this.ble.isLocationEnabled().then( (res)=> {
        console.log('Location enabled: ', res);
      }); */
      /* this.checkGPSPermission();
      console.log('Device UUID is: ' + this.device.uuid); */
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  reset() {
    this.router.navigate(['forgot-password']);
  }

  login() {
    const credentials = this.credentials.value;
   
    if (credentials.email !== null) {
      this.auth.signIn(credentials.email, credentials.password);
    } else {
      this.toast('Please enter your email & password', 'warning');
    }
  }

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

 /*  Scan(){
    this.devices = [];
    this.ble.scan([],15).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }
  onDeviceDiscovered(device){
    console.log('Discovered' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device);
      console.log(device);

      if (device.advertising !== '')
          console.log(JSON.stringify(this.bytesToString(device.advertising)));
          
    })
  }

  startScan() {
    this.devices = [];
    this.ble.startScan([]).subscribe (
      device => {
        this.onDeviceDiscovered(device);
        this.stop = true;
      }

    );
  }

  stopScan() {
    this.ble.stopScan().then( () => console.log('Scanning stopped'));
    this.stop = false;
  }

 stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
 }
 
 // ASCII only
 bytesToString(buffer) {
     return String.fromCharCode.apply(null, new Uint8Array(buffer));
 }

 //Check if application having GPS access permission  
 checkGPSPermission() {
  this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
    result => {
      if (result.hasPermission) {

        //If having permission show 'Turn On GPS' dialogue
        this.askToTurnOnGPS();
      } else {

        //If not having permission ask for permission
        this.requestGPSPermission();
      }
    },
    err => {
      alert(err);
    }
  );
}

requestGPSPermission() {
  this.locationAccuracy.canRequest().then((canRequest: boolean) => {
    if (canRequest) {
      console.log("4");
    } else {
      //Show 'GPS Permission Request' dialogue
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
        .then(
          () => {
            // call method to turn on GPS
            this.askToTurnOnGPS();
          },
          error => {
            //Show alert if user click on 'No Thanks'
            alert('requestPermission Error requesting location permissions ' + error)
          }
        );
    }
  });
}

askToTurnOnGPS() {
  this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
    () => {
      // When GPS Turned ON call method to get Accurate location coordinates
      this.startScan();
    },
    error => alert('Error requesting location permissions ' + JSON.stringify(error))
  );
}

public log(msg, level?) {
  level = level || "log";
  if (typeof msg === "object") {
      msg = JSON.stringify(msg, null, "  ");
  }
     // this.logmsg.push(msg);
}


async connectToDevice(device: any) {
  debugger;
  const alert = await this.alertController.create({
    header: 'Connect',
    message: 'Do you want to connect with?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Connect',
        handler: () => {
          this.ble.connect(device.address).subscribe((success) => {
            debugger;
            console.log(success);
          }, (error) => {
            debugger;
            console.log(error);
          });
        }
      }
    ]
  });
  alert.present();
}
 */
}
