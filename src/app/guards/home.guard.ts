import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     /*  return new Promise( (resolve, reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User) => {
          if(user) {
            resolve(true);
          } else {
            console.log('Home: User is not logged in');
            this.router.navigate(['login']);
            resolve(false);
          }
        });
      }); */
      
      return this.auth.user$
      .pipe(
        take(1),
        map(user => user ? true: false),
        tap(isLoggedIn => {
          console.log('home guard: ', isLoggedIn);
          if (isLoggedIn) {
            return true;
          }
          this.router.navigateByUrl('/login', { replaceUrl: true});
          return false;
        }) 
      ); 
  }
  
}
