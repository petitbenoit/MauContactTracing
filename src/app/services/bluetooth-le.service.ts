import { Injectable, NgZone } from '@angular/core';

import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BluetoothLEService {
  statusMessage: any;
  public logmsg: string[] = [];

  constructor(
    private bluetoothLE : BluetoothLE, 
    public alertController: AlertController,
    public ngZone: NgZone
    ) { 

    console.log("init bluetooth");
    bluetoothLE.initialize({ request: true, statusReceiver: false, restoreKey: "bluetoothleplugin"}).subscribe(result => {
      console.log("bluetooth init done");
      this.initializeSuccess(result);
    }, error => this.handleError(error));
  }

  async handleError(error) {
    const alert = this.alertController.create({
      message: error,
      header: 'Error'
    });
    
  }
  public initializeSuccess(result) {
    if (result.status === "enabled") {
        console.log("Bluetooth is enabled.");
        this.log(result);

        this.startScan();
    } else {
      this.log("Bluetooth is not enabled:", "status");
      this.log(result, "status");
    }
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
            this.bluetoothLE.connect(device.address).subscribe((success) => {
              debugger;
              console.log(success)
              this.setStatus(JSON.stringify(success));
            }, (error) => {
              debugger;
              console.log(error)
              // this.scanError(JSON.stringify(error));
            });
          }
        }
      ]
    });
    alert.present();
  }

  setStatus(message: string) {
    // console.log("message: " + message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  startScan() {

    this.bluetoothLE.startScan({services:[]}).subscribe( obj => {
      console.log('Start Scan: ', JSON.stringify(obj));
        if (obj.status == "scanResult")
        {
          //Device found
        }
        else if (obj.status == "scanStarted")
        {
          //Scan started
        }
      }
    );
  }

  connect(addr) {
    this.bluetoothLE.connect({address:addr}).subscribe( obj => {
        //Handle errors
        console.log(obj);
     
        if (obj.status == "connected") {
          //Device connected
        } else {
          //Device disconnected, handle this unexpected disconnect
        }
      }
    );
  }

  startScanSuccess(result) {
    if (result.status === "scanStarted") {
        this.log("Scanning for devices (will continue to scan until you select a device)...", "status");
    }
    else if (result.status === "scanResult" && result.address === 'F2:AE:E5:72:6A:94') {
        /* if (!this.devices.some((device) => {
            return device.address === result.address;

        })) {
            this.log('FOUND DEVICE ADVERTISMENT');
            this.log(result.advertisement);
            // bluetoothle.encodedStringToBytes
        } */
    }
  }
  
  public log(msg, level?) {
    level = level || "log";
    if (typeof msg === "object") {
        msg = JSON.stringify(msg, null, "  ");
    }
        this.logmsg.push(msg);
  }
}
