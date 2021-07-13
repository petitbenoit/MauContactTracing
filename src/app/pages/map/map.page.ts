import { ToastService } from 'src/app/services/toast.service';
import { CheckIn } from './../../models/user';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Injectable } from  '@angular/core';
import { DatePipe } from '@angular/common';

// import { Map, circle, tileLayer, canvas, PointTuple, marker, markerClusterGroup } from 'leaflet';

import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-search';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

declare var L : any;
// const fieldValue = admin.firestore.FieldValue; 
@Injectable()
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  marker$ = new Subject<any>();
  markers: Array<any>;
  pins$: Observable<any>;
  CovidCluster: any;
  CheckInCluster: any;
  layerGrp: any;
  centers: L.PointTuple;
  lat: any;
  lng: any;
  countries: any;
  map: L.Map;
  center = [ -20.290537322723324, 57.609424710504726 ];
  checkIn: any;
  userId: any;


  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private geolocation: Geolocation,
    private afs: AngularFirestore,
    private afauth : AngularFireAuth,
    private auth: AuthenticationService,
    private alertCtrl: AlertController,
    private toast: ToastService,
    private loadingCtrl: LoadingController
    ) {
     // this.cluster = new L.markerClusterGroup();

      const today = new Date();
      const yesterday = new Date(today.setHours(today.getHours() - 48));

      this.pins$ = this.marker$.pipe(
        switchMap(user => {
          return this.afs.doc(`user/${user}`)
        .collection('checkins').valueChanges();
        })
      );
      this.CheckInCluster = new L.MarkerClusterGroup();

      this.pins$.subscribe( markers => {
        this.markers = markers;
        console.log(markers);
        this.loadMarkers(this.markers);
      });

      
     }

  ngOnInit() {
    // this.getLocation();
  }



  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.center = [resp.coords.latitude, resp.coords.longitude];
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.center = [resp.coords.latitude, resp.coords.longitude];
      this.loadMap();
      // resp.coords.latitude
      // resp.coords.longitude

       // load after map to let map container initialized
      this.auth.user$.subscribe( user => {
      this.userId = user.userId;
      this.marker$.next(user.userId);
    });
     }).catch((error) => {
        this.loadMap();
       console.log('Error getting location', error);
     });
  
    
    
  }

  countriesMarker() {
    return new Promise((resolve, reject) => { 

    
    this.api.getLatest().subscribe( (data) => {
      this.countries = data;
      this.CovidCluster = new L.MarkerClusterGroup();
     // const markersLayerT = new L.LayerGroup();
      this.countries.forEach( (val) => {
        let marker = L.circle(
          [val.countryInfo['lat'], val.countryInfo['long']],
          {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: val.casesPerOneMillion * 1.1,
            title: val.country || 'Undefined'
          }
        )
        // .addTo(this.map)
        .bindPopup(
          `<div style="text-align: center;"><img width="30%" src="${val.countryInfo['flag']}"/>  <h6> <b>${val.country}</b> </h6></div>
       
          ${ val.province
            ? "<b>Province</b>: " + val.province + "<br/>"
            : ""}
            <b> Latest data:</b> ${this.datePipe.transform(val.updated)} <br/>
            - Population: ${val?.population} <br/>
            - Total Cases: ${val.cases}<br/>
            - Active: ${val.active}<br/>
            - Recovered: ${val.recovered}<br/>
            - Deaths: ${val.deaths}<br/>
            `);
         
          this.CovidCluster.addLayer(marker);
         
          //markersLayerT.add() 
      });
      this.CovidCluster.on('clusterclick', (a) => {
        a.layer.zoomToBounds();
      });
      resolve(this.map.addLayer(this.CovidCluster));
    });

  });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  loadMap() {
    // In setView add latLng and zoom
    this.map = new L.Map("map", {
      center: this.center,
      zoom: 8,
      renderer: L.canvas()
    });//.setView([28.6448, 77.216721], 4);

    this.map.locate({setView: true, maxZoom: 8});
    this.map.on('click', function(e) {

     // console.log(e);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
      maxNativeZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

   /*  var searchLayer = L.layerGroup().addTo(this.map);
    //... adding data in searchLayer ...
    this.map.addControl( new L.Control.Search({layer: searchLayer}) ); */
    //searchLayer is a L.LayerGroup contains searched markers
    this.countriesMarker().then( () => {
      var controlSearch = new L.Control.Search({
        position:'topright',		
        layer: this.CovidCluster,
        initial: false,
        zoom: 10.5,
        marker: false, //L.circleMarker([0,0],{radius:30}).on('click',function(){this.removeFrom(this.map)})
        textPlaceholder: 'Search here...'
      });
      controlSearch.on('search:locationfound', function(event) {
        setTimeout(function(){event.layer.openPopup()}, 1500);//.openOn(this.map);
      });
      this.map.addControl( controlSearch ); 
    });
    
  }


  getAddr(lat, lng):Promise<any> {
    return new Promise(resolve =>{
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(myJson => {
         resolve(myJson.address.neighbourhood+', '+myJson.address.state+', '+myJson.address.country);
        }); 


     });
  }

  markerLocation(coords){
    let lat = coords.split(',')[0];
    let lng = coords.split(',')[1];
    let markerLocation = L.marker([lat, lng]);
    markerLocation.bindPopup("<b>Your geolocation!</b>", { 
      closeButton: true
    });
    this.map.addLayer(markerLocation);
  }

  locate(map){
    // let latlngArray = [];
     let response:any;
   //  let parsedData = {};
    return new Promise(resolve => {
       map.locate() // This will return map so you can do chaining 
             .on('locationfound', (e) => {
               //locationCoord = e.latLng;
              console.log(e.latitude);
              response = e.latitude+','+e.longitude;
              resolve(response);
              
         });           
     });
   }

   location() {
     let locate = this.locate(this.map)
     .then( (data) => {
       this.markerLocation(data);
     })
   }

   loadMarkers(markers?) {
     let mark: any;
     this.CheckInCluster?.clearLayers();
    // console.log(markers);
    new Promise(resolve => {
      resolve (
        markers.forEach(day => {
       
          Object.keys(day).forEach( (marker:any) => {
           console.log(day[marker]);
            mark = this.drawMarker(day[marker].location, day[marker].name, day[marker].address, day[marker].timestamp, marker);
            this.CheckInCluster.addLayer(mark);
          }) 
        })
      )
    }).then(() => {
      this.CheckInCluster.on('clusterclick', (a) => {
        a.layer.zoomToBounds();
      });
      this.map.addLayer(this.CheckInCluster);
    }) 
     
   }

   drawMarker(latlng, location, address, timestamp, timeKey) {
    let marker: any;
    var people = new L.Icon({ 
      iconUrl:
        "assets/img/people_pin.png",
      iconSize: [51, 51], //[25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.getAddr(latlng[0], latlng[1]).then((val) => {
      console.log(val);
    });
    
    marker = L.marker(latlng, {
      title: `<b>${location}</b>`,
      icon: people
    });
    marker.bindPopup(`<b><center> ${this.datePipe.transform(timestamp, 'dd MMM yyyy, HH:mm')}</center> </b>
    <b><center>${location}</center></b> <br>
    ${address? 'Address: '+address+'<br>': ''} 
    Latitude: ${latlng[0]} <br> 
    Longitude: ${latlng[1]} <br>
    `);

    marker.on('dblclick', (e) => {
      console.log(e);
      this.deleteCheckIn(timestamp, location, address, timeKey);
    });

    return marker;
   }
   async deleteCheckIn(timestamp, message, address, timeKey) {
    const today = Intl.DateTimeFormat('fr-CA').format(new Date(timestamp));
     const alert = await this.alertCtrl.create({
       header: 'Delete check-in data',
       message: `Location: <b>${message}</b><br> 
       ${this.datePipe.transform(timestamp, 'dd MMM yyyy, HH:mm')} <br>
      ${address? 'Address: '+address : ''} `,
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           cssClass: 'secondary'
         },
         {
           text: 'Delete',
           handler: () => {
             console.log(today);
            let docRef = this.afs.doc(`user/${this.userId}/checkins/${today}`)
            //.collection('checkins').doc(today);
            docRef.update({
              [timeKey]: firebase.default.firestore.FieldValue.delete()
            })
           }
         }
       ]
     });
     alert.present();
   }
   async addCheckIn() {
     // this.map.locate().on('locationfound', async (e: any) => {
      this.geolocation.getCurrentPosition().then( async(resp) => {
      // const latlng =  [e.latitude,e.longitude];
      const latlng =  [resp.coords.latitude, resp.coords.longitude];
      const alert = await this.alertCtrl.create({
        header: 'New Check-in',
        inputs: [
          {
            name: 'locationName',
            type: 'text',
            placeholder: 'Location name',
            attributes: {
              minLength: 2
            }
          },
          {
            name: 'addr',
            type: 'text',
            placeholder: 'Address (if any)'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Save',
            handler: (data) => {
              if (data !== null) {
                console.log(data);

                const val:CheckIn = {
                    location: latlng,
                    timestamp: Date.now(),
                    name: data.locationName,
                    address: data.addr
                };

                this.saveCheckIn(val);
              }
            }
          }
        ]
      });

      alert.present();

     })
   }

   async saveCheckIn(info) {
     const loading = await this.loadingCtrl.create({
       message: 'Saving...',
       showBackdrop: true,
       spinner: 'crescent'
     });
    loading.present();

    const today = Intl.DateTimeFormat('fr-CA').format(Date.now());
    const now = Date.now();
    const data: CheckIn = info;

    this.afs.doc(`user/${this.userId}`)
    .collection('checkins').doc(today).set({
      [now]: data
    }, { merge: true}).then(() => {
      loading.dismiss();
      this.toast.presentToast('Save successfully!', 'success');
    }, error => {
      loading.dismiss();
      this.toast.presentToast(`An error occurred: ${error.message}`, 'danger');
    });

   }

}