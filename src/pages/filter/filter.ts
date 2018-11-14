import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-filter ',
  templateUrl: 'filter.html'
})
export class FilterPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {

  }

       dismiss() {
    this.viewCtrl.dismiss();
  }
}
