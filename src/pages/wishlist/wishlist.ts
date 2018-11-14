import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Global } from '../../providers/global';
import { Product } from "../../models/product.models";
import { ItemdetailPage } from '../itemdetail/itemdetail';

@Component({
	selector: 'page-wishlist ',
	templateUrl: 'wishlist.html',
	providers: [Global]
})

export class WishlistPage {
	private productsAll = new Array<Array<Product>>();
	private favorites = new Array<Product>();

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, private global: Global) {
		this.favorites = global.getFavorites();

		let proSplit = new Array<Product>();
		let productsAll = new Array<Array<Product>>();
		for (let pro of this.favorites) {
			if (proSplit.length == 2) {
				productsAll.push(proSplit);
				proSplit = new Array<Product>();
			}
			pro.favorite = true;
			proSplit.push(pro);
		}
		if (proSplit.length > 0) {
			productsAll.push(proSplit);
		}
		this.productsAll = productsAll;
	}

	toggleFavorite(pro) {
		pro.favorite = this.global.toggleFavorite(pro);
	}

	itemdetailPage(pro) {
		this.navCtrl.push(ItemdetailPage, { pro: pro, pros: this.favorites });
	}

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}

}
