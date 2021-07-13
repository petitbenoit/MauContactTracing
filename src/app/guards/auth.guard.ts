import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user$
    .pipe(
      take(1),
      map(user => user ? true: false),
      tap(isLoggedIn => {
        // console.log('auth');
        if (isLoggedIn) {
          return true;
        }
        this.router.navigateByUrl('/login', { replaceUrl: true});
        return false;
      })
    ); 
  }
}
