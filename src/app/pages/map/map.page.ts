import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Injectable } from  '@angular/core';
import { DatePipe } from '@angular/common';

import { Map, circle, tileLayer, canvas} from 'leaflet';

// declare var L : any;

@Injectable()
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
 
  countries: any;
  map: Map;
  center = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe
    ) {
     
     }

  ngOnInit() {
    this.api.getToken().subscribe( data => {
      this.api.loadBodyLocations(data.Token).subscribe( result => {
        console.log('Body location: ', result);
      });

      this.api.getSymptoms(data.Token).subscribe( res => {
          console.log('Symptoms: ', res);
          const dob = '1994';
          // Diagnosis
          this.api.loadDiagnosis(data.Token, [res[0].ID, res[6].ID], 'male', dob )
          .subscribe( result => console.log('Diagnostic results: ', result));
          // Specialisations
          this.api.loadSpecialisations(data.Token, [res[0].ID, res[6].ID], 'male', dob )
          .subscribe( result => console.log('Specialisations results: ', result));
          // Proposed symptoms
          this.api.loadProposedSymptoms(data.Token, [res[0].ID, res[6].ID], 'male', dob )
          .subscribe( result => console.log('Proposed Symptoms results: ', result));
      });

        this.api.loadIssues(data.Token).subscribe(res=> {
          console.log('Issues: ', res);

          this.api.loadIssueInfo(data.Token, res[0].ID).subscribe((info) => {
            console.log('Issues Info: ', info);
          });
        });
    });

  }

  ionViewDidEnter() {
    this.loadMap();

    this.api.getLatest().subscribe( (data) => {
      this.countries = data;
      this.countries.forEach( (val) => {
        circle(
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
            - Population: ${val?.population} <br/>
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
    this.map = new Map("map", {
      center: [ 25.3791924,55.4765436 ],
      zoom: 5,
      renderer: canvas()
    });//.setView([28.6448, 77.216721], 4);

    this.map.locate({setView: true, maxZoom: 7});

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
      maxNativeZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
    
  }
}