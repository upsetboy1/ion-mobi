import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-short',
  templateUrl: 'short.html'
})
export class ShortPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {

  }

  sort(si) {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
