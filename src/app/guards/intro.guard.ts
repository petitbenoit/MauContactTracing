import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { NavController } from '@ionic/angular';
// const { Storage } = Plugins;

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {
  constructor(private storageService: StorageService, private router:Router, private navCtrl: NavController) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    return new Promise( (resolve, reject) => {
      this.storageService.get(INTRO_KEY).then( hasSeenIntro => {
        // console.log(hasSeenIntro);
        if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
          resolve(true);
        } else {
          this.router.navigateByUrl('/intro', { replaceUrl: true });
          // this.router.navigateByUrl('/intro', { replaceUrl: true });
          resolve(true);
        }
      });
    })
      

    
    
  /*   if (hasSeenIntro && (hasSeenIntro.value === 'true')){
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl: true });
      return true;
    } */
  }
}
