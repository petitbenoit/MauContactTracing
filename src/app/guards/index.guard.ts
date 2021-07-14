import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

import { StorageService } from './../services/storage.service';

import { AuthConstants } from '../config/auth-constants';

import firebase from 'firebase/app';
import 'firebase/auth';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IndexGuard implements CanActivate {
  
  constructor(private storageService: StorageService, private auth: AuthenticationService, private router: Router, private afauth: AngularFireAuth) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise( (resolve, reject) => {
        console.log('index');
       
          // console.log(hasSeenIntro);

          this.afauth.authState.subscribe( (user) => {
            console.log('Index guard: ', user);
            if (user) {
              this.storageService.getJson(AuthConstants.AUTH).then( (stored:any) => {
                console.log(stored);
               /*  if (role === 'admin') {
                  this.router.navigate(['admin/feed']);
                } else { 
                  this.router.navigate(['home/dashboard']);
                /* } */
                
                if(stored.uid !== undefined && stored.uid === user.uid) {
                  if(stored.role !== undefined){
                    this.router.navigateByUrl('/admin/ble-admin');
                  } else {
                    this.router.navigateByUrl('/home/dashboard');
                    resolve(false);
                  }

                } else {
                  // this.router.navigateByUrl('/home/dashboard', { replaceUrl: true});
                  resolve(false);
                }
              });
            } else {
              this.storageService.get(INTRO_KEY).then( hasSeenIntro => {
                if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
                  resolve(true);
                /* return new Promise( (resolve, reject) => {
                  firebase.auth().onAuthStateChanged((user: firebase.User) => {
                    if (user) {
            
                      //this.storageService.get(AuthConstants.AUTH).then(role => {
            
                        if (role === 'admin') {
                          this.router.navigate(['admin/feed']);
                        } else { 
                          //this.router.navigate(['home/home']);
                        //}
            
                      //});
                      this.router.navigate(['home/dashboard']);
                      resolve(false);
                    } else {
                      resolve(true);
                    }
                  });
                }); */
                
                } else {
                  this.router.navigateByUrl('/intro', { replaceUrl: true });
                  // this.router.navigateByUrl('/intro', { replaceUrl: true });
                  resolve(true);
                }
              }); 
            }
          

          
        });

       
       // resolve(true);
      });/* this.auth.user$
      .pipe(
        take(1),
        map(user => user ? true: false),
        tap(isLoggedIn => {
          if (isLoggedIn) {
            this.router.navigateByUrl('/home', { replaceUrl: true});
            return false;
          }
          return true;
        })
      );  */

      /* new Promise( (resolve, reject) => {
        this.afauth.authState.subscribe( (user) => {
          if (user?.uid !== null) {
            this.router.navigateByUrl('/home', { replaceUrl: true});
            resolve(true);
          }
        });
        resolve(true);
      }) */
  }
  
}
