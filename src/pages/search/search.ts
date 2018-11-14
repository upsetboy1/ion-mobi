import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, ViewController, ModalController, NavParams } from 'ionic-angular';

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Global } from '../../providers/global';
import { Subscription } from "rxjs/Subscription";

import { ItemdetailPage } from '../itemdetail/itemdetail';
import { Constants } from "../../models/constants.models";
import { Product } from "../../models/product.models";
import { Currency } from "../../models/currency.models";

@Component({
	selector: 'page-search ',
	templateUrl: 'search.html',
	providers: [WordpressClient, Global]
})
export class SearchPage {
	private query: string;
	private currencyIcon: string;
	private currencyText: string;
	private subscriptions: Array<Subscription> = [];
	private productsAll = new Array<Array<Product>>();
	private productsResponse = new Array<Product>();
	private productsAllPage: number = 1;
	private queryHistory = new Array<string>();

	constructor(private navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private global: Global, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.queryHistory = global.getSearchHistory();
	}

	doSearch() {
		let subscription: Subscription = this.service.productsByQuery(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(data => {
			let products: Array<Product> = data;
			this.productsResponse = products;
			let proSplit = new Array<Product>();
			let productsAll = new Array<Array<Product>>();
			for (let pro of products) {
				if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
					continue;
				if (proSplit.length == 2) {
					productsAll.push(proSplit);
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
				productsAll.push(proSplit);
			}
			this.productsAll = productsAll;
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	doInfinite(infiniteScroll: any) {
		this.productsAllPage++;
		let subscription: Subscription = this.service.productsByQuery(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(data => {
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

	clearHistory() {
		this.global.clearSearchHistory();
		this.queryHistory = new Array<string>();
	}

	search(q) {
		this.query = q;
		this.productsAllPage = 1;
		this.doSearch();
		this.global.addInSearchHistory(q);
		this.showToast('Searching...');
	}

	getItems(searchbar: any) {
		var q = searchbar.srcElement.value;
		if (!q) { return; }
		this.search(q);
	}

	showToast(message: string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 1000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}
