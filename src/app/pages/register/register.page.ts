import { DeviceInfo, User } from './../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TestResult } from 'src/app/models/user';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string;
  email: string;
  phone: string;
  password: string;
  test: TestResult = {
    positive : false,
    createdAt: 0
  }
  testDisplay: boolean = false;
  testDateDisplay: string;

  constructor(
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private device: Device
  ) { 
    /* Object.keys(this.test).map((key) => {
      if (key === 'positive') {
        return (this.test[key] === 0) ? this.testDisplay = false : this.testDisplay = true;
      }
    }); */
  }

  ngOnInit() {

  }

  testPositive(date) {
    if (!date) {
      delete this.test.date;
      this.testDateDisplay = null;
     } 
  }

  backToLogin(){
this.router.navigate(['/login']);
  }
  async register() {
    if (this.name && this.email && this.phone && this.password) {

      const loading = await this.loadingCtrl.create({
        message : 'processing...',
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();

      this.afauth.createUserWithEmailAndPassword(this.email, this.password)
      .then((data)=> {
        data.user.sendEmailVerification();
        this.test.createdAt = Date.now();
        if (this.testDateDisplay !== null)
          this.test.date = new Date(this.testDateDisplay).getTime();
          
          let deviceInfos: DeviceInfo = {
            deviceManufacturer: this.device.manufacturer,
            deviceModel: this.device.model,
            devicePlatform: this.device.platform,
            deviceUUID: this.device.uuid
          }

          const user: User = {
            userId: data.user.uid,
            userName: this.name,
            userEmail: this.email,
            userPhone: this.phone,
            createdAt: Date.now(),
            testResult: this.test,
            deviceInfo: deviceInfos
          };

          this.afs.collection('user').doc(data.user.uid).set(user)
          .then(() => {
           
            this.afauth.signOut();
            
            this.email = null;
            this.name = null;
            this.phone = null;
            this.password = null;
            this.test.positive = false;
            this.test.date = null;

            loading.dismiss();
            this.toast('Registration Success! Please check your email!', 'success');
            
          })
          .catch( error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          });
      }).catch( error=> {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
    } else {
      this.toast('Please fill the form!', 'warning');
    }
  } // end of register

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });

    toast.present();
  } //end of toast
}
