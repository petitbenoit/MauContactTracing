import { User } from 'src/app/models/user';
import { Symptoms } from './../../models/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-symptoms-input',
  templateUrl: './symptoms-input.page.html',
  styleUrls: ['./symptoms-input.page.scss'],
})
export class SymptomsInputPage implements OnInit {
  symptoms: Symptoms = {
    temp: 0, 
    cough: 0, 
    fever: 0, 
    DiffToBreath: 0, 
    soreThroat: 0,
    headache: 0,
    remarks: '',
    private: 0
  };

  boolNotType = ['temp', 'remarks', 'updatedAt', 'score', 'consult'];

  formAdd:any;
  userId: string;
  readonly = true;
  sympt$ = new Subject<any>();
  symptoms$ : Observable<any>;

  constructor(
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    private toastr: ToastService,
    private auth: AuthenticationService,
    private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    this.sympt$ = new Subject<string>();

    this.symptoms$ = this.sympt$.pipe(
      switchMap(user => {
        return this.afs.doc(`user/${user}`).valueChanges();
      })
    );
    
    this.symptoms$.subscribe( user => {
      console.log(user);
      if (user.symptoms !== undefined) {
        this.symptoms = user?.symptoms;
        const val = user?.symptoms;
        Object.keys(val).map( key => {
          if( !this.boolNotType.includes(key)) {
            return (val[key] == 0)? val[key] = false : val[key] = true;
          }
        });
        this.symptoms = val;
        this.formAdd.patchValue(this.symptoms);
      }
      
    }, error => {
      console.log(error);
      this.toastr.presentToast(error.error+'.Please try again.', 'danger');
    });

    this.auth.user$.subscribe((user: any) => {
      this.userId = user?.userId;
      this.sympt$.next(user.userId);
    });

    
    this.formAdd = this.formBuilder.group({
      temp : new FormControl({value: this.symptoms.temp, disabled: this.readonly},  Validators.compose(
        [
          Validators.required, 
          //Validators.pattern('[0-9]+'),
          Validators.min(35)
        ])),
      cough : new FormControl({value: this.symptoms.cough, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      fever : new FormControl({value: this.symptoms.fever, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      DiffToBreath : new FormControl({value: this.symptoms.DiffToBreath, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      soreThroat : new FormControl({value: this.symptoms.soreThroat, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      headache : new FormControl({value: this.symptoms.headache, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      private : new FormControl({value: this.symptoms.private, disabled: this.readonly}, Validators.compose([
        Validators.required
      ])),
      remarks : new FormControl({value: this.symptoms.remarks, disabled: this.readonly}, Validators.compose([
        Validators.required
      ]))
      
    });
  }

  readOnly(readonly){
    if(!readonly) {
      this.formAdd.enable();
    } else {
      this.formAdd.disable();
    }
    this.readonly = readonly;
  }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.userId = user.userId;
    })
  }

  async refresh(event){
    this.auth.user$.subscribe((user: any) => {
      if (user.symptoms !== undefined) {
        const val = user?.symptoms;
        Object.keys(val).map( key => {
          if( !this.boolNotType.includes(key)) {
            return (val[key] == 0)? val[key] = false : val[key] = true;
          }
        });
        this.symptoms = val;
        if (event!==''){
          event.target.complete();
        }
        this.formAdd.patchValue(this.symptoms);
        this.readOnly(true);
      } else {
        if (event!==''){
          event.target.complete();
        }
      }
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async setSymptoms() {
    console.log(this.formAdd.value);
    
    const loading = await this.loadingCtrl.create({
      message: 'Updating...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    const symptoms = this.formAdd.value;
    Object.keys(symptoms).map( key => {
      if( !this.boolNotType.includes(key)) {
        return (symptoms[key] == false)? symptoms[key] = 0 : symptoms[key] = 1;
      }
    });

    if (symptoms.remarks !== null) {
      let consult = false;
      this.analyseSymptoms(symptoms).then((result) => {
        consult = this.resultScore(result);
        const totalScore = result;
        console.log(totalScore);
        const symptomsCollection: Symptoms = {...symptoms, 
          'consult' : consult,
          'score' : totalScore,
          'updatedAt': Date.now()
        };
        
        this.afs.collection('user').doc(this.userId
          ).set({
          'symptoms': symptomsCollection
        }, {merge: true})
        .then(() => {
          loading.dismiss();
          if (consult) {
          
          }
          this.toastr.presentToast('Update successfully!', 'success');
          if (this.resultScore(totalScore)) { 
            this.consultationPrompt();
          }
          this.readOnly(true);
        })
        .catch(error=> {
          loading.dismiss();
          this.toastr.presentToast(error.message, 'danger')
        });
      });

    } else {
      this.toastr.presentToast('Please fill all the blanks', 'warning');
    }

  }

  async consultationPrompt() {
     const alert = await this.alertCtrl.create({
       header: 'Contact hotline',
       message: `Please contact hotline service on <b>8924</b>. <br><br> You may have contracted the Covid-19 !`,
       buttons: [
         {
           text: 'Ok',
           role: 'cancel',
           cssClass: 'secondary'
         }
       ]
     });
     alert.present();
   }

  analyseSymptoms(symptoms: Symptoms) {
    return new Promise(resolve => {

    
    let total = 0;
    const score =
      {
        DiffToBreath: 10,
        cough: 5,
        fever: 12,
        headache: 5,
        soreThroat: 8
      };

      Object.keys(symptoms).map(key => { if (symptoms[key]) { return score[key]; } else { return 0; } })
      .forEach(val => {
          console.log(val);
          if (val !== undefined) {
            total += val;
          }
              
      });
      
      console.log(total);
      resolve(total);
    });
  }

  getScoreTemp(temp) { 
    if (temp >= 35 && temp < 37) {
      return 0;
    } else if (temp >= 37 && temp < 38) {
      return 10;
    } else if (temp >= 38 && temp < 40 ) {
      return 15;
    } else if (temp >= 40) {
      return 20;
    }
  }

  resultScore(score) {
    if (score >= 25) {
      return true
    } else {
      return false;
    }
  }

}
