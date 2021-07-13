import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../models/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.page.html',
  styleUrls: ['./manage-user.page.scss'],
})
export class ManageUserPage implements OnInit {

  roles: { name: string, value: string }[];
  textSearch: string;
  data: User;
  password: string;
  usersData: Array<any>;
  usersDataBackUp: any;

  users$: Observable<any>;
  user$ = new Subject<any>();
 
  automaticClose: false;

  constructor(
    public adminService: AdminService,
    public authService: AuthenticationService,
    public router: Router,
    private toastService: ToastService,
    // public user: UserService,
    private afs: AngularFirestore,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {

    this.user$ = new Subject<string>();

      this.users$ = this.user$.pipe(
        switchMap(user => {
          return this.afs.doc(`user/${user}`).valueChanges();
        //.collection('ble', ref => ref.where('time', '>=', yesterday.getTime())).valueChanges();
        })
      );
      
      this.users$.subscribe( result => {
        console.log(result);
        this.usersData.push(result);
        
      }, error => {
        console.log(error);
        this.toastService.presentToast(error.error+'.Please try again.', 'danger');
      });
  }

  async refreshPage() {
    this.usersData = [];
    const loading = await this.loadingCtrl.create({
      // cssClass: 'my-custom-class',
      message: 'Please wait...'
      // duration: 2000
    });
    await loading.present();
    this.getAllUsers().then(() => loading.dismiss());

  }
  getAllUsers() {
    // Get saved list of users
    return new Promise(resolve => {
      this.adminService.getUsersList()
      .subscribe( (res) => {
        this.usersData = [];

        res.forEach(userRecord => {
          // tslint:disable-next-line: no-shadowed-variable
          resolve(this.user$.next(userRecord.uid));
        });
      //
      // this.usersData = res;
      }, err => {
          this.toastService.presentToast('Cannot retrieve user\'s data : ' + err, 'danger');
      });
    });
  }


  async delete(user, index) {
    const loading = await this.loadingCtrl.create({
      // cssClass: 'my-custom-class',
      message: 'Deleting...',
      duration: 3000
    });
    await loading.present();

    // Delete item in Student data
    this.adminService.deleteUser(user.id)
    .subscribe(Res => {
    
      console.log(Res);
      this.usersData.splice(index, 1);

      let docRef = this.afs.doc(`user/${user.id}`)
            //.collection('checkins').doc(today);
      docRef.delete().then( () => {
        this.toastService.presentToast('Account has been deleted successfully!', 'success');
        loading.dismiss();
      });

    });
  }

   // Accordion list
   toggleSection(index) {
    this.usersData[index].open = !this.usersData[index].open;

    if (this.automaticClose && this.usersData[index].open) {
      this.usersData
      .filter( (item, itemIndex) => itemIndex !== index)
      .map(item => item.open = false);

    }
  }

  toggleItem(index, childIndex) {

  }
}
