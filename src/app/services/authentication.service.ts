import { StorageService } from './storage.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BluetoothInfo, User } from './../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthConstants } from './../config/auth-constants';
// import * as firebase from 'firebase';

import firebase from 'firebase/app';
import 'firebase/auth';

import { map, tap, switchMap, take } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  user$: Observable<User>;
  ble$ = new Subject<any>();
  blue$: Observable<any>;
  user: User;

  constructor(
    // private http: HttpClient
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private storageService: StorageService
    ) {
      this.user$ = this.afauth.authState
      .pipe(
        switchMap( user => {
          if (user)
          {
            return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    /*   const now = Intl.DateTimeFormat('fr-CA').format(Date.now());
      const today = new Date();
      const yesterday = new Date(today.setHours(today.getHours() - 48));
      this.afs.collection('user').doc(this.userId)
        .collection('bluetoothDevices').doc('2021-07-10')
        .collection('c755a1c21f9eda2f').valueChanges()
        .subscribe(snap => {
          console.log(snap);
        }) */

       this.ble$ = new Subject<string>();
       this.user$.subscribe( user => {
        this.blue$ = this.ble$.pipe(
          switchMap(time => {
            return this.afs.doc(`user/${user.userId}`)
          //.collection('bluetoothDevices').doc('2021-07-10')
          .collection('ble', ref => ref.where('time', '>=', time)).valueChanges();
          } //.doc(now.toString())
          )
        );
       })
      

      // subscribe to changes
     /*  queryObservable.subscribe(queriedItems => {
        console.log(queriedItems);  
      }); */
    // this.loadToken();
  }

  async signIn(email, password) {
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    this.afauth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then( () => {
      this.afauth.signInWithEmailAndPassword(email, password)
      .then( (data) => {
        if (!data.user.emailVerified) {
          loading.dismiss();
          this.toast('Please verify your email address!', 'warning');
          this.afauth.signOut();
        } else {
          console.log(this.user$.subscribe( data => console.log(data)));
            this.user$
            .subscribe( (user:any) => {
            this.storageService.store(AuthConstants.AUTH, {uid: data?.user.uid, role : user?.role});
              if (user.role !== undefined) {
                loading.dismiss();
                this.router.navigate(['admin']);
              } else {
                loading.dismiss();
                this.router.navigateByUrl('/home/dashboard', { replaceUrl: true});
              }
          });
          
        }
      })
      .catch( error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
    }).catch( error => {
      loading.dismiss();
      this.toast(error.message, 'danger');
    });
  } // end of signIn

  async signOut() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();

    this.afauth.signOut()
    .then( () => {
      loading.dismiss();
      this.router.navigateByUrl('/login', { replaceUrl: true});
    });
  } //end of signOut

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // end of toast

  /* async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  } */

  //login(credentials: {email, password}): Observable<any> {
    /* return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: this.token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    ) */
 // }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }
}
