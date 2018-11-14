import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from "../../models/constants.models";
import { Address } from "../../models/address.models";
import { UserResponse } from "../../models/user-response.models";

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';

@Component({
	selector: 'page-address ',
	templateUrl: 'address.html'
})
export class AddressPage {
	private address = new Address();
	private addresses: Array<Address>;

	constructor(public navCtrl: NavController, private navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, private toastCtrl: ToastController) {
		let address: Address = this.navParams.get('address');
		if (address != null) {
			this.address = address;
		} else {
			let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
			this.address.id = -1;
			if (user != null) {
				this.address.first_name = user.first_name;
				this.address.last_name = user.last_name;
				this.address.email = user.email;
			}
		}
		this.addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
	}

	saveAddress() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (this.address.first_name.length == 0) {
			this.showToast('Enter first name');
		} else if (this.address.last_name.length == 0) {
			this.showToast('Enter last name');
		} else if (this.address.email.length <= 5 || !reg.test(this.address.email)) {
			this.showToast('Enter valid email address');
		} else if (this.address.phone.length == 0) {
			this.showToast('Enter phone number');
		} else if (this.address.address_1.length == 0) {
			this.showToast('Enter address line one');
		} else if (this.address.address_2.length == 0) {
			this.showToast('Enter address line 2');
		} else if (this.address.city.length == 0) {
			this.showToast('Enter city');
		} else if (this.address.state.length == 0) {
			this.showToast('Enter state');
		} else if (this.address.postcode.length == 0) {
			this.showToast('Enter postcode');
		} else if (this.address.country.length == 0) {
			this.showToast('Enter country');
		} else {
			if (this.address.id == -1) {
				if (!this.addresses) {
					this.addresses = new Array<Address>();
				}
				this.address.id = this.addresses.length + 1;
				this.addresses.push(this.address);
			} else {
				let index = -1;
				for (let i = 0; i < this.addresses.length; i++) {
					if (this.address.id == this.addresses[i].id) {
						index = i;
						break;
					}
				}
				if (index != -1) {
					this.addresses[index] = this.address;
				}
			}
			window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(this.addresses));
			this.navCtrl.pop();
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
