import { ApiService } from './../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-symptoms-checker',
  templateUrl: './symptoms-checker.page.html',
  styleUrls: ['./symptoms-checker.page.scss'],
})
export class SymptomsCheckerPage implements OnInit {
  symptoms: any;
  selectedSymptoms: any;

  diagnosisResult: any;

  formSymptoms: FormGroup;
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJlbm9pdC5wZXRpdDk0QGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiOTMzOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGltaXQiOiI5OTk5OTk5OTkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXAiOiJQcmVtaXVtIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAyMS0wNi0yOSIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNjI0OTkyMjA1LCJuYmYiOjE2MjQ5ODUwMDV9.ZGEKfiWGM79UO_lak1mx2VOY57K6YmLEyCRJKW0KzpY";
  constructor(
    private toast: ToastService, 
    private loadingCtrl: LoadingController, 
    private api: ApiService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {

    this.formSymptoms = this.fb.group({
      symptoms: ['', [Validators.required]],
      gender: ['', [Validators.required,]],
      year_of_birth: ['', [Validators.required]]
    });

    this.refresh();
    this.api.getToken().subscribe( data => {
      console.log('Token: ', data.Token);
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

  addSymptom(event) {
    console.log(event.detail.value);
    this.selectedSymptoms = event.detail.value;
  }

  async getDiagnosis(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait..',
      spinner: 'crescent',
      showBackdrop: true,
      duration: 2000
    });
    loading.present();
    const diagnosis = this.formSymptoms.value;
    const yob = new Date(diagnosis.year_of_birth).getFullYear();

    this.api.loadDiagnosis(this.api.getConfigToken(), diagnosis.symptoms, diagnosis.gender, yob)
    .subscribe( result => {
      loading.dismiss();
      this.diagnosisResult = result;
      console.log(result);
      if (result[0] === undefined) {
        this.toast.presentToast('No result found!', 'warning');
      }
    }, error => {
      loading.dismiss();
      this.toast.presentToast(error.message, 'danger');
    });
   
  }
  async refresh() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait..',
      spinner: 'crescent',
      showBackdrop: true,
      duration: 2000
    });
    loading.present();

    this.api.getSymptoms(this.token).subscribe((symptoms) => {
      this.symptoms = symptoms;
      loading.dismiss();
    });
   // this.loading = true;
    /* setTimeout(() => {
      this.api.getSymptoms().subscribe(
        data => {
          this.latest = data["latest"];
          this.loading = false;
          this.toast.presentToast("Refreshing..", 'success');
        },
        error => {
          this.toastr("Ocorreu um erro ao atualizar os dados");
        }
      );
      event.target.complete();
    }, 1000); */
  }

}
