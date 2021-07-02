import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string;
  reset: FormGroup;
  constructor(
    private afauth: AngularFireAuth,
    private toastr: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.reset = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
     /*  password: ['', [Validators.required, Validators.minLength(6)]] */
    });
  }

  async resetPassword() {
    if (this.reset.value.email !== '') {
      const loading = await this.loadingCtrl.create({
        message: 'Sending reset password link...',
        spinner: 'crescent',
        showBackdrop: true
      });
      
      loading.present();

      this.afauth.sendPasswordResetEmail(this.email).then(()=> {
        loading.dismiss();
        this.toast('An email has been sent.', 'success');
        this.router.navigate(['/login']);
      })
      .catch(error=> {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
    } else {
      this.toast('Please enter your email address.', 'warning');
    }
    
  } // end of reset password

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
