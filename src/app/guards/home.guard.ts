import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth.user$
      .pipe(
        take(1),
        map(user => user ? true: false),
        tap(isLoggedIn => {
          // console.log(isLoggedIn);
          if (isLoggedIn) {
            return true;
          }
          this.router.navigateByUrl('', { replaceUrl: true});
          return false;
        }) 
      );
  }
  
}
