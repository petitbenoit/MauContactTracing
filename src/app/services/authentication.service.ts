import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  
  constructor(
    // private http: HttpClient
    ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  //login(credentials: {email, password}): Observable<any> {
    /* return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: this.token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    ) */
 // }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }
}
