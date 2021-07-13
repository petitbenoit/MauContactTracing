import { StorageService } from './../../services/storage.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
// Angular
import { promise } from 'protractor';
import { Router } from '@angular/router';
// Native
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// Services
import { ToastService } from './../../services/toast.service';
import { ApiService } from './../../services/api.service';
import { AuthenticationService } from './../../services/authentication.service';
// Pages
import { BleScannerPage } from './../ble-scanner/ble-scanner.page';
import { NewsPage } from './../news/news.page';
import { DatePipe } from '@angular/common';
// config
import { AuthConstants } from './../../config/auth-constants';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { BluetoothInfo } from 'src/app/models/user';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const parser = require('bleadvertise');

/* const advlib = require('advlib');

const PROCESSORS = [
    { processor: require('advlib-ble'),
      libraries: [ require('advlib-ble-services'),
                   require('advlib-ble-manufacturers') ],
      options: { ignoreProtocolOverhead: true } }
]; */

const advlib = require('advlib-ble');

const LIBRARIES = [ require('advlib-ble-services'),
                    require('advlib-ble-manufacturers') ];

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public statusMessage: string;
  public addressKey = "address";
  locationCoords: any;
  dailyNews: [];
  latestNews: any;
  timetest: any;
  devices: any[] = [];
  bleDevices: any[]=[];
  public logmsg: string[] = [];
  worldData: any;
  userId: string;
  deviceExist: string[] = [];

  constructor(
    public ble: BLE,
    private device: Device,
    public bluetoothle: BluetoothLE,
    public platform: Platform,
    private ngZone: NgZone,
    public toastController: ToastController,
    public toast: ToastService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertController: AlertController,
    public modalCtrl: ModalController,
    private auth: AuthenticationService,
    private router: Router,
    private api: ApiService,
    private iab: InAppBrowser,
    private datePipe: DatePipe,
    private afs: AngularFirestore,
    private storageService: StorageService,
    private backgroundMode: BackgroundMode,
    private geolocation : Geolocation

  ) {
    this.platform.ready().then((readySource) => {

      this.auth.user$.subscribe((user: any) => {
        this.userId = user?.userId;  
        console.log(this.userId);
        
      });
      this.api.getMauritiusData().subscribe((data) => console.log(data));
      //this.backgroundMode.enable();
      this.ble.enable();
      this.ble.isLocationEnabled().then( (res)=> {
        console.log('Location enabled: ', res);
      }); 
       this.checkGPSPermission();
      console.log('Device UUID is: ' + this.device.uuid);

      console.log('Platform ready from', readySource);
      this.bluetoothle.enable();
      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status) // logs 'enabled'
        //this.setStatus(ble.status);

        this.startScan();
      });

     /*  const size$ = new Subject<string>();
      const queryObservable = size$.pipe(
        switchMap(size => 
          afs.collection('items', ref => ref.where('size', '==', size)).valueChanges()
        )
      ); */

      // subscribe to changes
     /*  queryObservable.subscribe(queriedItems => {
        console.log(queriedItems);  
      }); */
      this.auth.blue$.subscribe( val => {
        console.log(val);
      });
      const today = new Date();
      const yesterday = new Date(today.setHours(today.getHours() - 48));
      this.auth.ble$.next(yesterday.getTime());

      /* const now = Intl.DateTimeFormat('fr-CA').format(Date.now());
      const today = new Date();
      const yesterday = new Date(today.setHours(today.getHours() - 48));
      this.afs.collection('user').doc(this.userId)
        .collection('bluetoothDevices').doc('2021-07-10')
        .collection('c755a1c21f9eda2f').valueChanges()
        .subscribe(snap => {
          console.log(snap);
        }) */
      //this.Scan();
      //this.startScan();
    });
    //this.checkGPSPermission();
    
   }

  ngOnInit(
  ) {
    this.refresh('');
    // this.api.getLatest().subscribe(data => console.log('Latest: ', data));
    // this.api.getWorldData().subscribe(data=> console.log('All', data));
  }

  sendBLEData(info) {
    this.geolocation.getCurrentPosition().then((resp) => {
      const geolocation = [resp.coords.latitude, resp.coords.longitude];
      const now = Date.now();
      const bluetoothCollection: BluetoothInfo = {
        deviceManufacturer: this.device.manufacturer,
        devicePlatform: this.device.platform,
        deviceModel: this.device.model,
        deviceUUID: this.device.uuid,
        name: info.name || 'unknown',
        address: info.address,
        location: geolocation,
        time: now,
        transmissionPower : info.rssi,
        advertising: info.advertisement,
        payload: info.payload
      }

      //const today = Intl.DateTimeFormat('fr-CA').format(now);
        console.log(this.device.uuid);
      this.afs.doc('user/'+ this.userId)
        //.collection('bluetoothDevices').doc(today)
        .collection('ble').doc(now.toString())
      .set(bluetoothCollection).then(() => {
        this.toast.presentToast(`1 BLE device detected.`, 'success');
      });

      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  async openBLEDevices() {
    const addModal = await this.modalCtrl.create({
      component: BleScannerPage,
      // cssClass: 'my-custom-class',
      swipeToClose: true,
      /* componentProps: {
        'ble': this.bledevices
      } */
    });

    return await addModal.present();
  }
  async openNewsList() {
    const addModal = await this.modalCtrl.create({
      component: NewsPage,
      // cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        'news': this.dailyNews
      } 
    });

    return await addModal.present();
  }

  async presentLogOutConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout',
      message: '<strong>Do you want to logout ?</strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    // this.storageService.removeStorageItem(AuthConstants.AUTH).then(res => {
      this.auth.signOut();
      this.router.navigateByUrl('/login',  { replaceUrl: true});
    // });
  }

  refresh(event) {
    this.getWorldData().then(() => {
      this.getDailyNews().then(() => {
        if(event !== '')
          event.target.complete();
      });
    });
  }
   
  getWorldData() {
    return new Promise ((resolve) => {
      this.api.getWorldData().subscribe((data) => {
        resolve(this.worldData = data);
        console.log('world ', this.worldData);
      }, error => {
        console.log(error.message);
        resolve(this.toast.presentToast(error.message, 'danger'));
      });
    });
  }

  async openWorldCases() {
    
    const alert = await this.alertController.create({
      header: `World Cases`,
      message: `
      Updated: <b>${this.datePipe.transform(this.worldData?.updated, 'dd MMM yyyy, HH:mm')}</b><br><hr>
      Population: <b>${this.worldData?.population}</b><br><hr>
      Active: <b>${this.worldData?.active}</b><br>
      Recovered: <b>${this.worldData?.recovered}</b><br>
      Critical: <b>${this.worldData?.critical}</b><br>
      Deaths: <b>${this.worldData?.deaths}</b><br>
      Tests: <b>${this.worldData?.tests}</b><br>
      <hr>
      Today Cases: <b>${this.worldData?.todayCases}</b><br>
      Today Recovered: <b>${this.worldData?.todayRecovered}</b><br>
      Today Deaths: <b>${this.worldData?.todayDeaths}</b><br>
      `,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  getDailyNews() {
    return new Promise((resolve, reject) => {
        this.api.getDailyNews().subscribe((data) => {
        this.dailyNews = data.articles;
        
        this.dailyNews.sort((a:any, b:any) => {
          return +new Date(a.published_date) - +new Date(b.published_date);
        }); 
       
        //console.log(data);
        //this.dailyNews.reverse();
       
        const reversed = this.dailyNews.reverse();
        // console.log('HERE -> ' ,reversed);
        this.latestNews =  reversed[0];
        
        resolve(this.latestNews);
      }, error => {
        console.log(error);
        resolve(this.toast.presentToast(error?.error?.errors[0], 'danger'));
      });
    });
  }
  openLink(link) {
    this.iab.create(link, '_self', { location: 'no'});
  }

  goToProfile() {
    this.router.navigate(['/home/profile']);
  }
    //Check if application having BluetoothLE access permission
    checkBLEPermission() {
      this.bluetoothle.requestPermission().then((res) => {
        console.log(res.requestPermission);
        console.log("res :" + res);
      }, (err) => {
        console.log("err: " + err);
      })
    }
  arrBufToString() {
    
  }
    arrayBuffer2String(buf, callback) {
    var bb = new MSBlobBuilder();
    bb.append(buf);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result)
    }
    f.readAsText(bb.getBlob());
}

ab2str(buf) {
var bufView = new Uint16Array(buf);
var unis =""
for (var i = 0; i < bufView.length; i++) {
    unis=unis+String.fromCharCode(bufView[i]);
}
return unis
}
asHexString(i) {
    var hex;

    hex = i.toString(16);

    // zero padding
    if (hex.length === 1) {
        hex = "0" + hex;
    }

    return "0x" + hex;
}

getAdvData(buffer) {
  var convertData = String.fromCharCode.apply(null, new Uint8Array(buffer) );
  var hexResult = [];
  console.log(convertData.length);
  for (var i = 0; i < convertData.length; i++) {

    var resultNumber = convertData.charCodeAt(i);   //Dec
    var str = (+resultNumber).toString(16)
    var resultString: String = ""
    if (str.length <= 1) {
      resultString = ("0" + (+resultNumber).toString(16)).toUpperCase().substring(-2); //String
    } else {
      resultString = ("" + (+resultNumber).toString(16)).toUpperCase().substring(-2); //String
    }

    hexResult[i] = "0x" + resultString;

    

  }

  console.log("hex data:::", hexResult)
}

parseAdvertisingData(buffer) {
    var length, type, data, i = 0, advertisementData = {};
    var bytes = new Uint8Array(buffer);

    while (length !== 0) {

        length = bytes[i] & 0xFF;
        i++;

        // decode type constants from https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
        type = bytes[i] & 0xFF;
        i++;

        data = bytes.slice(i, i + length - 1).buffer; // length includes type byte, but not length byte
        i += length - 2;  // move to end of data
        i++;

        advertisementData[this.asHexString(type)] = data;
    }
  console.log('Adv Data : ', advertisementData);
    return advertisementData;
}


Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

getAdvertisingData(buffer) {
  ////////////////////////////////////////////////////////////////////////////////
        const packets = parser.parse(buffer);

console.log(packets); // 3
console.log(packets[0].type); // Flags
console.log( String.fromCharCode.apply(null, new Uint8Array(packets[0].data) )); //  [ 'LE Limited Discoverable Mode' ]

// console.log(packets[1].type); // 'Incomplete List of 128-bit Service Class UUIDs'
// console.log(packets[1].data); // [ '0xba5689a6fabfa2bd01467d6e3858abad' ]
//////////////////////////////////////////////////////////////////////////////////////////
}

 /*   Scan(){
    this.ble.scan([],30).subscribe( 
      device => {

        // this.ble.read(device.id,"0000", "0000").then( result => console.log(result), err => console.log('err: ', err));
        const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  const hexStr = toHexString(new Uint8Array(device.advertising));
console.log(device.id, ': ', '0x'+hexStr); 

        this.getAdvData(device.advertising);

         const mfData = new Uint8Array(device.advertising);
        const hex = Buffer.from(mfData).toString('hex');
        const buf = Buffer.from(hex); 
        this.parseAdvertisingData(buf);
        device.advertising = hex;

        this.ngZone.run(() => {
          //this.pushToArray(this.devices, success);
         this.bledevices.push(device);
          
        });
        console.log('HEX1: ',hex);

        if (buf) {
                // first 2 bytes are the 16 bit UUID
                console.log(buf.slice(0,2));
                var uuidBytes = new Uint16Array(buf.slice(0,2));
                console.log('uuidBytes: ', uuidBytes);
                var uuid = uuidBytes[0].toString(16); // hex string
                console.log("Found service data for " + uuid);
                // remaining bytes are the service data, expecting 32bit floating point number
                this.parseAdvertisingData(buf.slice(2));
                var data = new Float32Array(buf.slice(2));
                console.log(data);
            }
        // console.log(parser.serialize(parser.parse(buf)));


        
        const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(Buffer.from(mfData));
       console.log( asciiString);
let options = { ignoreProtocolOverhead: true };
        //let packet = 'c21d04acbe55daba16096164766c6962206279207265656c79416374697665';
 let processedPacket = advlib.process(hex,4 , LIBRARIES);
 

console.log(processedPacket); 

console.log(this.bytesToString(processedPacket.advA));
this.getAdvertisingData(buf);
      


        var convertData = this.bytesToString(device.advertising);
        
var hexResult = [];

for (var i=0; i < convertData.length; i++){
   var resultNumber = convertData.charCodeAt(i);   //Dec
   var resultString = ("00" + (+resultNumber).toString(16)).substr(-2); //String
   hexResult[i] = "0x" + resultString;
}
console.log('HEX: ', hexResult);

/* if (hexResult) {
                // first 2 bytes are the 16 bit UUID
                console.log(hexResult.slice(0,2));
                var uuidBytes = new Uint16Array(hexResult.slice(0,2));
                console.log('uuidBytes: ', uuidBytes);
                var uuid = uuidBytes[0].toString(16); // hex string
                console.log("Found service data for " + uuid);
                // remaining bytes are the service data, expecting 32bit floating point number
                this.parseAdvertisingData(hexResult.slice(2));
                var data = new Float32Array(hexResult.slice(2));
                console.log(data);
            } 

//////////////////////////////////////////////////////////////////////
        var SERVICE_DATA_KEY = '0xff';
        console.log('BLE : ', device);
        const advertisingData = this.parseAdvertisingData(device.advertising);
        console.log('ParseAdvData: ', advertisingData);
        /* const serviceData = advertisingData[SERVICE_DATA_KEY];
        console.log('new: ', new Uint16Array(device.advertising));
            if (serviceData) {
                // first 2 bytes are the 16 bit UUID
                var uuidBytes = new Uint16Array(serviceData.slice(0,2));
                console.log('uuidBytes: ', uuidBytes);
                var uuid = uuidBytes[0].toString(16); // hex string
                console.log("Found service data for " + uuid);
                // remaining bytes are the service data, expecting 32bit floating point number
                var data = new Float32Array(serviceData.slice(2));
                console.log(data[0]);
            } 
        
      }
    );
  } */
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
        },
        error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
    }
  
    adapterInfo() {
      this.bluetoothle.getAdapterInfo().then((success) => {
        // console.log("adapterInfo: " + success.name);
        this.setStatus(success.name);
      })
      this.checkBLEPermission();
    }
    bytesToString(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
arrayBufferToString(buffer){

    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2,16)-1;

    for(var i = 0;i<length;i+=addition){

        if(i + addition > length){
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
    }

    return result;

}
  pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.address === obj.address);

    if (index === -1 && obj !== null) {
        arr.push(obj);
    } else {
        arr[index] = obj;
    }
  }

  startScan() {
    let params = {
      services: [
       /*  "180D",
        "180F" */
      ],
    }
    this.bleDevices = [];
    this.bluetoothle.startScan({ services: [] }).subscribe((success) => {
      
      
      if(typeof success.advertisement !== undefined && 
        success.advertisement !== null && success.advertisement !== '') {

        if (typeof success.advertisement == 'string') {
            const mfgData = this.bluetoothle.encodedStringToBytes(success.advertisement);
            const hex = Buffer.from(mfgData).toString('hex');
            success['payload'] = hex;

            if (success.rssi && success.rssi >= -50) {
              if (success.address && !this.deviceExist.includes(success.address)){
                // check in first contact + timestamp
                console.log(success);
                this.sendBLEData(success);
                this.deviceExist.push(success.address);
              } else {
                // checkinInternal timestamp interval 15 second
                // check out // update latest timestamp
                // if date.now - initial checkin timestamp < 16min checkout 

              }
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

    /* startScan() {
      let params = {
        services: [
         //  "180D",
          // "180F" 
        ],
      }
      this.setStatus('Scanning for Bluetooth LE Devices');
      this.devices = []; 
      this.bluetoothle.startScan({ services: [] }).subscribe((success) => {
        
        if(typeof success.advertisement !== undefined && 
          success.advertisement !== null && success.advertisement !== '') {
            
           console.log(success);
            if (typeof success.advertisement == 'string') {
                const mfgData = this.bluetoothle.encodedStringToBytes(success.advertisement);
                const hex = Buffer.from(mfgData).toString('hex');
                console.log('bluetoothle hex: ', hex);
                // if (mfgData !== null) this.getAdvertisingData(buf);
                // console.log('Manufacturer Data is', mfgData);
               
                /* const s1 = this.bytesToString(mfgData);
                // var enc = new TextDecoder(); // always utf-8
                console.log(this.arrayBufferToString(this.bluetoothle.stringToBytes(success.advertisement)));
                console.log('Data: ', String.fromCharCode(...this.bluetoothle.encodedStringToBytes('Hv8GAAEJIALjOxGcNRdF/fPeBP9YQz2DcV43TrH0Rg')));
                // const s2 = this.bluetoothle.(success.advertisement);
                console.log(s1);
                success.advertisement = s1; 
              }
            }
            
           // clear list
       // debugger;
        // console.log("startScan: " + JSON.stringify(success));
        this.setStatus(JSON.stringify(success.status));
        this.ngZone.run(() => {
          
          this.pushToArray(this.devices, success);
         // this.devices.push(success);
          
        });
        // console.log(typeof success.advertisement);
        
        if (success.status == "scanResult") {
          //Device found
          console.log("scanResult");
        }
        else if (success.status == "scanStarted") {
          //Scan started
          console.log("scanStarted");
        }
      }, (error) => {
        console.log("error: " + JSON.stringify(error));
        this.scanError(JSON.stringify(error));
      })
  
      setTimeout(() => {
        this.setStatus.bind(this);
      }, 5000, 'Scan complete');
    } */
  
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
              this.bluetoothle.connect(device.address).subscribe((success) => {
                debugger;
                console.log(success)
                this.setStatus(JSON.stringify(success));
              }, (error) => {
                debugger;
                console.log(error)
                this.scanError(JSON.stringify(error));
              });
            }
          }
        ]
      });
      alert.present();
    }
  
    stopScan() {
      this.bluetoothle.stopScan().then((resp) => {
        console.log("stopScan: " + resp);
        this.setStatus(resp.status);
      })
    }
  
    retrieveConnected() {
      let params = {
        "services": [
          /* "180D",
          "180F" */
        ]
      }
  
      this.bluetoothle.retrieveConnected(params).then((resp) => {
        console.log("retrieveConnected: " + resp.devices);
        this.setStatus("retrieveConnected");
      })
    }
  
    // If location permission is denied, you'll end up here
    async scanError(error: string) {
      this.setStatus('Error ' + error);
      const toast = await this.toastController.create({
        message: 'Error scanning for Bluetooth low energy devices',
        position: 'middle',
        duration: 5000
      });
      toast.present();
    }
  
    setStatus(message: string) {
      // console.log("message: " + message);
      this.ngZone.run(() => {
        this.statusMessage = message;
      });
    }

    public log(msg, level?) {
      level = level || "log";
      if (typeof msg === "object") {
          msg = JSON.stringify(msg, null, "  ");
      }
          this.logmsg.push(msg);
    }

   /*  decode(message) {
      return this.bluetoothle.bytesToEncodedString(message);
    } */

}
