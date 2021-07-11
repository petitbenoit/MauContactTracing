import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

//const parser = require('@danke77/ble-advertise');
//const parser = require('ble-ad-parser');
const parser = require('ble-utils').advertising;
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
    public bluetoothLE: BluetoothLE,
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
   // this.Scan();
   this.startScan();
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
    // this.BLE.stopScan();
    this.bluetoothLE.stopScan();
    this.bleDevices = [];
    this.toggle = false;
  }

  startScan() {
    let params = {
      services: [
       /*  "180D",
        "180F" */
      ],
    }
    this.bleDevices = [];
    this.bluetoothLE.startScan({ services: [] }).subscribe((success) => {
      
      
      if(typeof success.advertisement !== undefined && 
        success.advertisement !== null && success.advertisement !== '') {

        if (typeof success.advertisement == 'string') {
            const mfgData = this.bluetoothLE.encodedStringToBytes(success.advertisement);
            const buf = Buffer.from(mfgData);
            const hex = Buffer.from(mfgData).toString('hex');
            success['payload'] = hex;
            const packets = parser.parse(buf);
            console.log(packets);
            /**
             * console.log(packets.length); // 5
                console.log(packets[0].type); // Flags
                console.log(packets[0].data); // [ 'LE General Discoverable Mode', 'BR/EDR Not Supported' ]
                console.log(packets[1].type); // 'Complete List of 16-bit Service Class UUIDs'
                console.log(packets[1].data); // [ 'febe' ]
             */
            if (success.rssi >= -50) {
              console.log(success);
            }
        }
        this.ngZone.run(() => {
          this.pushToArray(this.bleDevices, success);
        });
      }
    }, (error) => {
      console.log("error: " + JSON.stringify(error));
    })
  }

  pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.address === obj.address);

    if (index === -1 && obj !== null) {
        arr.push(obj);
    } else {
        arr[index] = obj;
    }
  }

}
