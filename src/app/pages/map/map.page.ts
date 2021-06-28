import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Injectable } from  '@angular/core';
import { DatePipe } from '@angular/common';

import 'leaflet';

declare var L : any;

@Injectable()
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
 
  countries: any;
  map: L.Map;
  center = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe
    ) {
     
     }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadMap();

    this.api.getLatest().subscribe( (data) => {
      this.countries = data;
      this.countries.forEach( (val) => {
        L.circle(
          [val.countryInfo['lat'], val.countryInfo['long']],
          {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: val.casesPerOneMillion * 1.1
          }
        )
        .addTo(this.map)
        .bindPopup(
          `<div style="text-align: center;"><img width="30%" src="${val.countryInfo['flag']}"/>  <h6> <b>${val.country}</b> </h6></div>
       
          ${ val.province
            ? "<b>Province</b>: " + val.province + "<br/>"
            : ""}
            <b> Latest data:</b> ${this.datePipe.transform(val.updated)} <br/>
            - Total Cases: ${val.cases}<br/>
            - Active: ${val.active}<br/>
            - Recovered: ${val.recovered}<br/>
            - Deaths: ${val.deaths}<br/>
            `
          );
      });
    });
    
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  loadMap() {
    // In setView add latLng and zoom

    this.map = L.map('map', {
      center: [ 25.3791924,55.4765436 ],
      zoom: 4,
      renderer: L.canvas()
    });

    this.map.locate({setView: true, maxZoom: 7});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
      maxNativeZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
    
  }
}