import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BluetoothInfo, User } from 'src/app/models/user';
import { DatePipe } from '@angular/common';
import { Device } from '@ionic-native/device/ngx';
import { BleScannerPage } from '../ble-scanner/ble-scanner.page';

@Component({
  selector: 'app-ble-admin',
  templateUrl: './ble-admin.page.html',
  styleUrls: ['./ble-admin.page.scss'],
})
export class BleAdminPage implements OnInit {
  user$: Observable<User>;
  ble$ = new Subject<any>();
  blue$: Observable<any>;
  userList: any;
  selectedUserDeviceList: Array<any>;
  status: boolean = true;
  selectedTestDate: number;
  selectedUser: any;
  usersByid: any;
  constructor(
    // private http: HttpClient
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    public platform: Platform,
    //private router: Router,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private modalCtrl: ModalController,
    private auth: AuthenticationService,
    private alertController: AlertController,
    private router: Router
    //private storageService: StorageService
    ) {
      this.platform.ready().then((readySource) => {

      this.ble$ = new Subject<string>();

      this.blue$ = this.ble$.pipe(
        switchMap(user => {
          const testDate = this.selectedTestDate ? new Date(this.selectedTestDate) : new Date(); 
          const yesterday = new Date(testDate.setHours(testDate.getHours() - 48));
          return this.afs.doc(`user/${user}`)
        .collection('ble', ref => ref.where('time', '>=', yesterday.getTime())).valueChanges();
        })
      );
      
      this.blue$.subscribe( (result: Array<BluetoothInfo>) => {
        console.log(result);
        console.log(this.selectedUserDeviceList = result.filter((val: any) => { return val.name !== 'unknown'}));
        // this.selectedUserDeviceList = result;
        this.selectedUserDeviceList.map( (bleInfo: BluetoothInfo) => {

          this.afs.collection('user', ref => ref.where('deviceInfo.deviceUUID', '==', bleInfo.name)).valueChanges()
          .subscribe( val => bleInfo['contacts'] = val[0]);
        })
       
        
      }, error => {
        console.log(error);
        this.toast.presentToast(error.error+'.Please try again.', 'danger');
      });

      this.initUsersByStatus(true); // init user$

      this.user$.subscribe(user => { // subscribe to users
        console.log(user);
        this.userList = user;
        this.usersByid = Object.keys(user).map( key => { console.log(key)});
      })


    }); // platform end here
  }

  ngOnInit() {}

  async refresh(event?) { // refresh users 
    
    this.user$.subscribe(user => { // subscribe to users
      console.log(user);
      this.userList = user;
      this.selectedUserDeviceList = [];
      this.selectedUser = null;
      if(event !== undefined){
        event.target.complete();

      }
    })
 
  }

  loadUser(e) {
    console.log(e.detail.value)
    if(e !== undefined && e.detail.value !== undefined && e.detail.value.length > 0) {
      let selectDate = this.usersByid[e.detail.value].testDate;
      this.selectedUser = this.usersByid[e.detail.value];
      console.log(this.selectedUser);
      if (!isNaN(selectDate)) {
        this.selectedTestDate = selectDate;
        console.log(selectDate);
      }
      this.ble$.next(e.detail.value);
        
    }
   
  }

  getUserByStatus(status) {
    console.log(status);
    this.initUsersByStatus(status);
    this.user$.subscribe( users => {
      this.userList = users;
      let json = {};
      Object.keys(users).map( key => { 
        json[users[key].id] = users[key];
      });
      this.usersByid = json;
      this.selectedUserDeviceList = null;
      console.log(this.usersByid);
    })
  }

  initUsersByStatus(positive = false) {

    this.user$ = this.afauth.authState
      .pipe(
        switchMap( user => { 
          if (user)
          {
            return this.afs.collection(`user`, ref => 
              ref.where('testResult.positive', '==', positive) 
            ).valueChanges().pipe(
              map((user) => user.map((us:User) => { return {
                id: us.userId, 
                name: us.userName, 
                contact: us.userPhone, 
                testDate: us.testResult['date']
              }}))
            )
          } else {
            return of(null);
          }
        })
      );
  }

  async openBLEDevices() {
    console.log('test');
    const addModal = await this.modalCtrl.create({
      component: BleScannerPage,
      swipeToClose: true,
    });
   addModal.present();
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

}
