import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';


import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';

@Component({
  selector: 'page-help ',
  templateUrl: 'help.html'
})
export class HelpPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  cartPage() {
    let modal = this.modalCtrl.create(CartPage);
    modal.present();
  }

  searchPage() {
    let modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }

  wishlistPage() {
    this.navCtrl.push(WishlistPage);
  }


}
