import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-ble-scanner',
  templateUrl: './ble-scanner.page.html',
  styleUrls: ['./ble-scanner.page.scss'],
})
export class BleScannerPage implements OnInit {
  bleDevices: any[]=[];
  toggle = true;

  constructor(public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    public BLE: BLE,
    public ngZone: NgZone) { 
      // this.bleDevices = navParams.get('ble');
      this.platform.ready().then((readySource) => {
        this.BLE.isLocationEnabled().then( (res)=> {
          console.log('Location enabled: ', res);
        }); 
        this.BLE.enable();
      });
    }

  ngOnInit() {
    this.Scan();
  }

  cancel() {
    this.stopScan();
    this.modalCtrl.dismiss();
  }

  Scan() {
    this.BLE.startScan([]).subscribe( 
      device => {
          const mfData = new Uint8Array(device.advertising);
          const hex = Buffer.from(mfData).toString('hex');

          device.advertising = hex;

          this.ngZone.run(() => {
            console.log(device.id+': ' , device.rssi);
            // this.bleDevices.push(device);
          this.pushToArray(this.bleDevices, device);
          });
      });
      this.toggle = true;
  }

  stopScan() {
    this.BLE.stopScan();
    this.bleDevices = [];
    this.toggle = false;
  }

  pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.id === obj.id);

    if (index === -1 && obj !== null) {
        arr.push(obj);
    } else {
        arr[index] = obj;
    }
  }

}
