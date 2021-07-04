import { ToastService } from './../../services/toast.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  news: any;
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    // private loadingCtrl: LoadingController,
    private api: ApiService,
    private toast: ToastService,
    private iab: InAppBrowser
  ) { 
    this.news = navParams.get('news');
  }

  ngOnInit() {
  }

  async getDailyNews(event) {
    /* const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      showBackdrop: true,
      spinner: 'crescent'
    });
    loading.present(); */

    this.api.getDailyNews().subscribe((data) => {
     /*  loading.dismiss(); */
      this.news = data.articles;
      this.news.sort((a:any, b:any) => {
        return +new Date(a.published_date) - +new Date(b.published_date);
      }); 
      this.news.reverse();
      if (event!=='')
        event.target.complete();
    }, error => {
    /*   loading.dismiss(); */
      if (event!=='') {
        event.target.complete();
      }
      this.toast.presentToast(error?.error?.errors[0], 'danger');
    });
  }

  openLink(link) {
    this.iab.create(link, '_self', { location: 'no'});
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}
