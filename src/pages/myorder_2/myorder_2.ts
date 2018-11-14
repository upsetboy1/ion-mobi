import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { Constants } from "../../models/constants.models";
import { Order } from "../../models/order.models";
import { UserResponse } from "../../models/user-response.models";
import { LineItem } from "../../models/line-item.models";
import { OrderUpdateRequest } from "../../models/order-update-request.models";

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { ItemdetailPage } from '../itemdetail/itemdetail';
import { Currency } from "../../models/currency.models";

@Component({
	selector: 'page-myorder_2 ',
	templateUrl: 'myorder_2.html',
	providers: [WordpressClient]
})

export class Myorder_2Page {
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];
	private orders = new Array<Order>();

	private user: UserResponse;
	private pageNo: number = 1;
	private currencyIcon: string = '';
	private currencyText: string = '';

	constructor(public modalCtrl: ModalController, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		this.loadMyOrders();
		this.presentLoading('loading orders');
		let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (currency) {
			this.currencyText = currency.value;
			let iconText = currency.options[currency.value];
			this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
		}
	}

	loadMyOrders() {
		let subscription: Subscription = this.service.myOrders(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(data => {
			for (let order of data) {
				for (let line of order.line_items) {
					line.price_html = this.currencyIcon + ' ' + line.price;
				}
			}
			this.dismissLoading();
			this.orders = data;
		}, err => {
			this.dismissLoading();
		});
		this.subscriptions.push(subscription);
	}

	itemdetailPage(item: LineItem) {
		this.navCtrl.push(ItemdetailPage, { pro_id: item.product_id });
	}

	cancelOrder(order) {
		this.presentLoading('Cancelling order');
		let subscription: Subscription = this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(order.id), new OrderUpdateRequest('cancelled')).subscribe(data => {
			let orderRes: Order = data;
			order.status = 'cancelled';
			/* for(let o of this.orders) {
				console.log(String(o.id) == String(orderRes.id));
				if(o.id == orderRes.id) {
					o = orderRes;
					console.log('here');
					this.orders = this.orders;
					break;
				}
			} */
			this.dismissLoading();
			this.showToast('Order cancelled');
		}, err => {
			console.log(err);
		});
		this.subscriptions.push(subscription);
	}

	doInfinite(infiniteScroll: any) {
		this.pageNo++;
		let subscription: Subscription = this.service.myOrders(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(data => {
			let orders: Array<Order> = data;
			for (let order of data) {
				for (let line of order.line_items) {
					line.price_html = this.currencyIcon + ' ' + line.price;
				}
			}
			infiniteScroll.complete();
		}, err => {
			infiniteScroll.complete();
			console.log(err);
		});
		this.subscriptions.push(subscription);
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

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}

}
