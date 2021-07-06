import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Injectable } from  '@angular/core';
import { DatePipe } from '@angular/common';

// import { Map, circle, tileLayer, canvas, PointTuple, marker, markerClusterGroup } from 'leaflet';

import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-search';

import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var L : any;

@Injectable()
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  cluster: any;
  layerGrp: any;
  centers: L.PointTuple;
  lat: any;
  lng: any;
  countries: any;
  map: L.Map;
  center = [ -20.290537322723324, 57.609424710504726 ];
  checkIn: any;

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private geolocation: Geolocation
    ) {
     // this.cluster = new L.markerClusterGroup();
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
     }).catch((error) => {
        this.loadMap();
       console.log('Error getting location', error);
     });
    // this.loadMap();

   
    
  }

  countriesMarker() {
    return new Promise((resolve, reject) => { 

    
    this.api.getLatest().subscribe( (data) => {
      this.countries = data;
      this.cluster = new L.MarkerClusterGroup();
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
         
          this.cluster.addLayer(marker);
         
          //markersLayerT.add() 
      });
      this.cluster.on('clusterclick', (a) => {
        a.layer.zoomToBounds();
      });
      resolve(this.map.addLayer(this.cluster));
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
        layer: this.cluster,
        initial: false,
        zoom: 20.5,
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

}