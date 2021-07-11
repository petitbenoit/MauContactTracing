import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, Platform, ToastController, ModalController } from '@ionic/angular';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
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
  selectedUserDeviceList: any;
  status: boolean = true;

  constructor(
    // private http: HttpClient
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    public platform: Platform,
    //private router: Router,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private modalCtrl: ModalController
    //private storageService: StorageService
    ) {
      this.platform.ready().then((readySource) => {
        // list users who are positive with Covid-19
      /* this.user$ = this.afauth.authState
      .pipe(
        switchMap( user => {
          if (user)
          {
            return this.afs.collection(`user`, ref => 
              ref.where('testResult.positive', '==', true) 
            ).valueChanges().pipe(
              map((user) => user.map((us:User) => { return {id: us.userId, name: us.userName, contact: us.userPhone}}))
            )
          } else {
            return of(null);
          }
        })
      ); */
      this.setResultTest(true);
      

      this.ble$ = new Subject<string>();
      const today = new Date();
      const yesterday = new Date(today.setHours(today.getHours() - 48));

      this.blue$ = this.ble$.pipe(
        switchMap(user => {
          return this.afs.doc(`user/${user}`)
        .collection('ble', ref => ref.where('time', '>=', yesterday.getTime())).valueChanges();
        })
      );

      this.user$.subscribe( user => {
        
        this.userList = user;
        console.log('userPos: ', this.userList);
        //this.afs.doc(`user/${user[0]}`).collection
        /* this.afs.doc(`user/${user[0]}`).collection('ble').valueChanges()
        .subscribe( val => console.log('Result: ', val));
 */     this.refresh();
        this.ble$.next(user[1].id);
      /*  this.ble$ = new Subject<string>();
       this.blue$ = this.ble$.pipe(
        switchMap(user => {
          return this.afs.doc(`user`)
        .collection('ble', ref => ref.where('time', '>=', time)).valueChanges();
        } 
        )
        );  */

       /* this.user$.subscribe( user => {
         console.log('userPos: ', user);
         Object.keys(user).forEach( key => {
           const userPositive = user[key];

         })
       */
       }) 
    });
  }

  ngOnInit() {
  }
  async refresh(event?) {
    
    this.blue$.subscribe( result => {
      console.log(result);
      this.selectedUserDeviceList = result;
      if(event !== undefined){
        event.target.complete();
      }
    }, error => {
      console.log(error);
      this.toast.presentToast(error.error+'.Please try again.', 'danger');
    });

  }

  loadUser(e) {
    if(e !== undefined && e.detail.value !== undefined && e.detail.value.length > 0)
    this.ble$.next(e.detail.value);
  }
  getUser(status) {
    console.log(status);
    this.setResultTest(status);
    this.user$.subscribe( users => {
      this.userList = users;
      this.selectedUserDeviceList = null;
      console.log(this.userList);
    })
  }

  setResultTest(positive = false) {

    this.user$ = this.afauth.authState
      .pipe(
        switchMap( user => { 
          if (user)
          {
            return this.afs.collection(`user`, ref => 
              ref.where('testResult.positive', '==', positive) 
            ).valueChanges().pipe(
              map((user) => user.map((us:User) => { return {id: us.userId, name: us.userName, contact: us.userPhone}}))
            )
          } else {
            return of(null);
          }
        })
      );
  }

  async openBLEDevices() {
    const addModal = await this.modalCtrl.create({
      component: BleScannerPage,
      swipeToClose: true,
    });
    return await addModal.present();
  }

}
