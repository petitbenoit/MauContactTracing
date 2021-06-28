import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

import { StorageService } from './../services/storage.service';

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
        this.storageService.get(INTRO_KEY).then( hasSeenIntro => {
          // console.log(hasSeenIntro);
          if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
            this.afauth.authState.subscribe( (user) => {
              // console.log(user);
              if (user !== null) {
                this.router.navigateByUrl('/home', { replaceUrl: true});
                resolve(true);
              } else {
                resolve(true);
              }
            });
            
          } else {
            this.router.navigateByUrl('/intro', { replaceUrl: true });
            // this.router.navigateByUrl('/intro', { replaceUrl: true });
            resolve(true);
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
