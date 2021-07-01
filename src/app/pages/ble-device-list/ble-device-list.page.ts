import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-ble-device-list',
  templateUrl: './ble-device-list.page.html',
  styleUrls: ['./ble-device-list.page.scss'],
})
export class BleDeviceListPage implements OnInit {
  bleDevices: any[]=[];
  toggle = true;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    public BLE: BLE,
    public ngZone: NgZone) { 
      // this.bleDevices = navParams.get('ble');
      this.platform.ready().then((readySource) => {
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
            this.bleDevices.push(device);
          });
      });
      this.toggle = true;
  }

  stopScan() {
    this.BLE.stopScan();
    this.bleDevices = [];
    this.toggle = false;
  }
}
