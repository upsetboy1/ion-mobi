import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { Constants } from "../../models/constants.models";
import { Address } from "../../models/address.models";
import { AddressPage } from '../address/address';

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { UserResponse } from '../../models/user-response.models';
@Component({
	selector: 'page-addressselect ',
	templateUrl: 'addressselect.html',
	providers: [WordpressClient]
})
export class AddressSelectPage {
	private addresses = new Array<Address>();
	private select: boolean;
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];

	constructor(private navParams: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, private toastCtrl: ToastController, private service: WordpressClient, private loadingCtrl: LoadingController) {
		this.select = (navParams.get('action') != null);
	}

	ionViewDidEnter() {
		let addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
		if (addresses != null) {
			this.addresses = addresses;
		}
	}

	addressNew() {
		this.navCtrl.push(AddressPage);
	}

	addressEditSelect(address: Address) {
		if (this.select) {
			for (let add of this.addresses) {
				if (add.id == -100) {
					add.id = address.id;
					break;
				}
			}

			address.id = -100;
			let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
			user.billing = address;
			user.shipping = address;
			user.first_name = address.first_name;
			user.last_name = address.last_name;
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(user));
			window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(address));

			this.presentLoading('Just a moment');
			let subscription: Subscription = this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(user.id), user).subscribe(data => {
				this.dismissLoading();
				this.navCtrl.pop();
			}, err => {
				this.dismissLoading();
				this.navCtrl.pop();
			});
			this.subscriptions.push(subscription);
		} else {
			this.navCtrl.push(AddressPage, { address: address });
		}
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

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}
}
