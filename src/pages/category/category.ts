import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { SearchPage } from '../search/search';
import { ShirtsPage } from '../shirts/shirts';
import { CartPage } from '../cart/cart';
import {Category} from "../../models/category.models";
import {Constants} from "../../models/constants.models";

@Component({
  selector: 'page-category ',
  templateUrl: 'category.html'
})
export class CategoryPage {
	private categoriesAll = new Array<Array<Category>>();
	
	constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
		let categoriesAll: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
		let parentWithChild:Array<Category>;
		for (let catP of categoriesAll) {
			if (Number(catP.parent) == 0) {
				parentWithChild = new Array<Category>();
				parentWithChild.push(catP);
				for (let catC of categoriesAll) {
					if (Number(catP.id) == Number(catC.parent)) {
						parentWithChild.push(catC);
					}
				}
				this.categoriesAll.push(parentWithChild);
			}
		}
	}
	
	shirtsPage(cat: Category) {
		if(cat.id != '-1') {
			this.navCtrl.push(ShirtsPage, {cat:cat});
		}
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
