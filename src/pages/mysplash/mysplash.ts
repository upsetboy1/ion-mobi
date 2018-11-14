import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Constants } from '../../models/constants.models';
import { Category } from '../../models/category.models';
@Component({
  selector: 'page-mysplash',
  templateUrl: 'mysplash.html'
})
export class MySplashPage {

  constructor(private events: Events, public navCtrl: NavController) {
    let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
    if (categories) {
      this.navCtrl.setRoot(HomePage);
    } else {
      events.subscribe('category:setup', () => {
        this.navCtrl.setRoot(HomePage);
      });
    }
  }

}
