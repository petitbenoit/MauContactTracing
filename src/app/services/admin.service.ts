import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  // API path
  basePath = 'http://localhost:3000/users';
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    public http: HttpClient
  ) { }
  
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  // Get user lists
  public getUsersList(): Observable <any> {
    return this.http.get(this.basePath)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // Get user by uid
  public getUserById(uid): Observable <any> {
    return this.http
    .get(this.basePath + '/' + uid)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  public createUser(users): Observable <any> {
    const postData = {
            email: users.email,
            password : users.password,
            displayName: users.displayName
          };

    return this.http
      .post(this.basePath, postData, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  public updateUser(uid, userRecord): Observable <any> {
    return this.http
    .put(this.basePath + '/' + uid, userRecord, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  public updatedUser(uid, userRecord): Promise <any> {
    return new Promise( (resolve) => {this.updateUser(uid, userRecord).subscribe( (res) => resolve(res))});
  }

  public deleteUser(uid) {
    return this.http
    .delete(this.basePath + '/' + uid, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
