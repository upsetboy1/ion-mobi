import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, MenuController, ModalController, NavParams } from 'ionic-angular';

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Global } from '../../providers/global';
import { Subscription } from "rxjs/Subscription";

import { ShortPage } from '../short/short';
import { CartPage } from '../cart/cart';
import { FilterPage } from '../filter/filter';
import { SearchPage } from '../search/search';
import { ItemdetailPage } from '../itemdetail/itemdetail';
import { WishlistPage } from '../wishlist/wishlist';
import { Category } from "../../models/category.models";
import { Constants } from "../../models/constants.models";
import { Product } from "../../models/product.models";
import { Currency } from "../../models/currency.models";

@Component({
	selector: 'page-shirts ',
	templateUrl: 'shirts.html',
	providers: [WordpressClient, Global]
})

export class ShirtsPage {
	private category: Category;
	private loading: Loading;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private productsAll = new Array<Array<Product>>();
	private productsResponse = new Array<Product>();
	private productsAllPage: number = 1;
	private currencyIcon: string;
	private currencyText: string;

	constructor(private navParams: NavParams, public modalCtrl: ModalController, private global: Global, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.category = navParams.get('cat');
		this.loadProducts();
		this.presentLoading('loading products');
	}

	loadProducts() {
		let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.category.id, String(this.productsAllPage)).subscribe(data => {
			this.dismissLoading();
			let products: Array<Product> = data;
			this.productsResponse = products;
			let proSplit = new Array<Product>();
			for (let pro of products) {
				if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
					continue;
				if (proSplit.length == 2) {
					this.productsAll.push(proSplit);
					proSplit = new Array<Product>();
				}
				if (!this.currencyText) {
					let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
					if (currency) {
						this.currencyText = currency.value;
						let iconText = currency.options[currency.value];
						this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
					}
				}
				if (!pro.sale_price) {
					pro.sale_price = pro.regular_price;
				}
				if (this.currencyIcon) {
					pro.regular_price_html = this.currencyIcon + ' ' + pro.regular_price;
					pro.sale_price_html = this.currencyIcon + ' ' + pro.sale_price;
				} else if (this.currencyText) {
					pro.regular_price_html = this.currencyText + ' ' + pro.regular_price;
					pro.sale_price_html = this.currencyText + ' ' + pro.sale_price;
				}
				pro.favorite = this.global.isFavorite(pro);
				proSplit.push(pro);
			}
			if (proSplit.length > 0) {
				this.productsAll.push(proSplit);
			}
			this.productsAll = this.productsAll;
		}, err => {
			this.dismissLoading();
		});
		this.subscriptions.push(subscription);
	}

	doInfinite(infiniteScroll: any) {
		this.productsAllPage++;
		let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.category.id, String(this.productsAllPage)).subscribe(data => {
			let products: Array<Product> = data;
			this.productsResponse = products;
			let proSplit = new Array<Product>();
			for (let pro of products) {
				if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
					continue;
				if (proSplit.length == 2) {
					this.productsAll.push(proSplit);
					proSplit = new Array<Product>();
				}
				if (!this.currencyText) {
					let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
					if (currency) {
						this.currencyText = currency.value;
						let iconText = currency.options[currency.value];
						this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
					}
				}
				if (!pro.sale_price) {
					pro.sale_price = pro.regular_price;
				}
				if (this.currencyIcon) {
					pro.regular_price_html = this.currencyIcon + ' ' + pro.regular_price;
					pro.sale_price_html = this.currencyIcon + ' ' + pro.sale_price;
				} else if (this.currencyText) {
					pro.regular_price_html = this.currencyText + ' ' + pro.regular_price;
					pro.sale_price_html = this.currencyText + ' ' + pro.sale_price;
				}
				pro.favorite = this.global.isFavorite(pro);
				proSplit.push(pro);
			}
			if (proSplit.length > 0) {
				this.productsAll.push(proSplit);
			}
			infiniteScroll.complete();
		}, err => {
			infiniteScroll.complete();
			console.log(err);
		});
		this.subscriptions.push(subscription);
	}

	itemdetailPage(pro) {
		this.navCtrl.push(ItemdetailPage, { pro: pro, pros: this.productsResponse });
	}

	private presentLoading(message: string) {
		this.loading = this.loadingCtrl.create({
			content: message
		});

		this.loading.onDidDismiss(() => { });

		this.loading.present();
		this.loadingShown = true;
	}

	private dismissLoading() {
		if (this.loadingShown) {
			this.loadingShown = false;
			this.loading.dismiss();
		}
	}

	private presentErrorAlert(msg: string) {
		let alert = this.alertCtrl.create({
			title: 'Error',
			subTitle: msg,
			buttons: ['Dismiss']
		});
		alert.present();
	}

	showToast(message: string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}

	sortPage() {
		let modal = this.modalCtrl.create(ShortPage);
		modal.onDidDismiss(() => { });
		modal.present();
	}

	filterPage() {
		let modal = this.modalCtrl.create(FilterPage);
		modal.present();
	}

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}
	wishlistPage() {
		this.navCtrl.push(WishlistPage);
	}
}
