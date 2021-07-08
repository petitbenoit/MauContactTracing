import { User } from './../../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TestResult } from 'src/app/models/user';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  userId: string;
  name: string;
  email: string;
  phone: string;
  test: TestResult = {
    positive: false,
    createdAt: 0
  };
  createdAt: number;
  testDateDisplay: any;

  constructor(
    private auth: AuthenticationService,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private router: Router  
  ) { 
    this.auth.user$.subscribe(user => {
      this.userId = user.userId;
      this.name = user.userName;
      this.email = user.userEmail;
      this.phone = user.userPhone;
      this.test = user.testResult;
      this.createdAt = user.createdAt;
      if (user.testResult.date !== undefined && user.testResult.date !== null)
        this.testDateDisplay = new Date(user?.testResult?.date).toUTCString();
    })
  }

  ngOnInit() {
    
  }

  testPositive(date) {
   console.log(date);
   if (!date) {
    this.test.date = null;
    this.testDateDisplay = null;
   } 
   console.log(this.test);
  }
  async updateProfile() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    if (this.testDateDisplay !== null)
      this.test.date = new Date(this.testDateDisplay).getTime();

    const user : User = {
      userId: this.userId,
      userName: this.name,
      userEmail: this.email,
      userPhone: this.phone,
      createdAt: this.createdAt,
      updatedAt: Date.now(),
      testResult: this.test
    };
    
    this.afs.collection('user').doc(this.userId).set(
      user, 
      {merge: true})
    .then(() => {
      loading.dismiss();
      this.toast('Update Success!', 'success');
      this.router.navigate(['/profile']);
    })
    .catch(error=> {
      loading.dismiss();
      this.toast(error.message, 'danger')
    });
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

}
