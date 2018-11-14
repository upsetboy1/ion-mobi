import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
@Component({
  selector: 'page-myorder_1 ',
  templateUrl: 'myorder_1.html'
})
export class Myorder_1Page {

 constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  
  searchPage() {
    let modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
  
    cartPage() {
    let modal = this.modalCtrl.create(CartPage);
    modal.present();
  }

}
