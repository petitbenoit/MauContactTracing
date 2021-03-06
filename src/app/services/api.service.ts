import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
//import  * as CryptoJS from "crypto-js";
// import 'crypto-js';
import { HmacMD5, enc } from 'crypto-js';

// import { HmacMD5 } from "hm";
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJlbm9pdC5wZXRpdDk0QGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiOTMzOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGltaXQiOiI5OTk5OTk5OTkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXAiOiJQcmVtaXVtIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAyMS0wNi0yOSIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNjI0OTk1OTk3LCJuYmYiOjE2MjQ5ODg3OTd9.KGbjXow7X03Pt2chhgldmSsXhz5F9GRl4QE59ufJs7Q";
  private url: string = "https://corona.lmao.ninja/v2/countries?yesterday&sort";
  private specificCountryUrl = "https://corona.lmao.ninja/v2/countries/:query?yesterday=true&strict=true&query =";
  // private newsAPI = "https://newsapi.org/v2/everything?q=covid-19&sortby=popularity&apiKey=363d365fb4c94ccaac006446b635d48b";
  private gNewsAPI = "https://gnews.io/api/v4/search?q=covid19&lang=en&token=15c0efa54ddc07701f3c57b348c30cb9&sortby=publishedAt"; // relevance
  private worldAPI = "https://corona.lmao.ninja/v2/all?yesterday";
  // symptoms checker API
  private priaidAuthURL = "https://sandbox-authservice.priaid.ch";
  private priaidURL = "https://sandbox-healthservice.priaid.ch";

  private freeNews = "https://free-news.p.rapidapi.com/v1/search?q=covid-19&lang=en";

  // countries 
  private coronaAPI="https://corona-api.com/countries";
  
  constructor(private http: HttpClient) { 
    this.getToken().subscribe( data => this.token = data.Token);
  }
  
  getMauritiusData() {
    const uri = `${this.coronaAPI}/mu`;

    const headers = new HttpHeaders()
    .set("Access-Control-Allow-Origin", "*")
    .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    .set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    //.set('Content-type', 'application/json')
    .set('x-rapidapi-key', '3f20764480msh261109a6369b196p1fb3e5jsn15fb7139b3a9')
    .set('x-rapidapi-host', 'priaid-symptom-checker-v1.p.rapidapi.com');
    const postData = {};
    return this.http.get( uri ,{ headers: headers});
  }

  getMUData() {
    const country = "Mauritius";
    const uri = `https://corona.lmao.ninja/v2/countries/`;

    const headers = new HttpHeaders()
    .set("Accept", "*/*")
    .set("Access-Control-Allow-Origin", "*")
    .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    .set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    //.set('Content-type', 'application/json')
    const postData = { "query" : "Mauritius"};

    return this.http.get( uri , {headers: headers });
  }

  getWorldData() {
    return this.http.get(this.worldAPI);
  }

  getConfigToken(){
    return this.token;
  }

  getToken(): Observable<any> {
    const uri = `${this.priaidAuthURL}/login`;
    const api_key = "benoit.petit94@gmail.com";
    const secret_key = "e2XRg59Nmf4QJn3s8";
    var computedHash = HmacMD5(uri, secret_key);
    var computedHashString = computedHash.toString(enc.Base64); 
    const headers = new HttpHeaders().set('Content-type', 'application/json')
                                    .set('Accept', 'application/json')
                                   // .set('responseType', 'text')
                                    .set('Authorization', 'Bearer ' + api_key + ":" + computedHashString);
    const postData = {};
    return this.http.post( uri, postData, { headers: headers})
  }

  getLatest(): Observable<any> {
    return this.http.get(this.url);
  }
  // Symptoms Checker APIs
  getSymptoms(token) {
    return this.http.get(`${this.priaidURL}/symptoms?token=${token}&language=en-gb&format=json`);
  }

  loadIssues(token) {

    let url = `${this.priaidURL}/issues`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers});
  }

  loadIssueInfo(token, issueId) {
    
    let url = `${this.priaidURL}/issues/${issueId}/info`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers});
  }

  loadDiagnosis(token, symptoms, gender, yearOfBirth) {

    // let symptoms = selectedSymptoms.split(',');
    let url = `${this.priaidURL}/diagnosis?symptoms=`+JSON.stringify(symptoms)+`&gender=${gender}&year_of_birth=${yearOfBirth}`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers});
  }

  loadSpecialisations(token, symptoms, gender, yearOfBirth) {

    // let symptoms = selectedSymptoms.split(',');
    let url = `${this.priaidURL}/diagnosis/specialisations?symptoms=`+JSON.stringify(symptoms)+`&gender=${gender}&year_of_birth=${yearOfBirth}`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers});
  }

  loadProposedSymptoms(token, symptoms, gender,yearOfBirth) {
    // let symptoms = selectedSymptoms.split(',');
    let url = `${this.priaidURL}/symptoms/proposed?symptoms=`+JSON.stringify(symptoms)+`&gender=${gender}&year_of_birth=${yearOfBirth}`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers});
   
  }

  loadBodyLocations(token) {

    let url = `${this.priaidURL}/body/locations`;
    let headers = new HttpHeaders()
    let extraArgs = 'token='+token+'&language=en-gb&format=json';
    url += url.indexOf("?") > 0 ? "&"+extraArgs : "?"+extraArgs;

    return this.http.get(url, {headers: headers}); 
  }

  // Daily news covid-19
  getDailyNews(): Observable<any> {
    // &from=2021-06-28&to=2021-06-28
    const today = new Date();
    const yesterday = new Date(today.setHours(today.getHours() - 12));
    const from = yesterday.toISOString();
   
    //const to = today.toISOString();
   // const to = new Intl.DateTimeFormat('fr-CA').format(today);
    //const from = new Intl.DateTimeFormat('fr-CA').format(yesterday);
    
    //console.log('from: ', from);
    let headers = new HttpHeaders()
    .set('x-rapidapi-key', '3f20764480msh261109a6369b196p1fb3e5jsn15fb7139b3a9')
    .set('x-rapidapi-host', 'free-news.p.rapidapi.com');
    /* .set('Content-type', 'application/json')
    .set('Accept', 'application/json'); */
   /*  .set("Access-Control-Allow-Origin", "*")
    .set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
    .set("Access-Control-Allow-Headers", "X-Requested-With,content-type")
    .set("Access-Control-Allow-Credentials", "true")
    .set("Upgrade", "HTTP/2.0")
    .set('Connection', 'Upgrade')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json'); */
    console.log(`${this.freeNews}&from=${from}`);
    return this.http.get(`${this.freeNews}`, {headers: headers});
  }

  getDatabyCountry(name: string): Observable<any>{
    console.log(this.specificCountryUrl+name);
    return this.http.get(this.url);
  }

  getLocations(): Observable<any> {
    return this.http
      .get(`${this.url}/locations`)
      .pipe(map(data => data["locations"]));
  }

  getLocation(location): Observable<any> {
    return this.http.get(`${this.url}/locations/${location}`);
  }
}
