import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { Address } from "../../models/address.models";
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { AddressSelectPage } from '../addressselect/addressselect';
import { AddressPage } from '../address/address';


@Component({
	selector: 'page-my_account ',
	templateUrl: 'my_account.html'
})
export class My_accountPage {
	account: string = "profile";
	private user: UserResponse;
	private selectedAddress: Address;
	private addressChangeText = 'Change';

	constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
	}

	ionViewDidEnter() {
		this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
		this.addressChangeText = this.selectedAddress == null ? 'Add' : 'Change';
	}

	addressPage() {
		this.navCtrl.push(AddressSelectPage, { action: 'choose' });
	}
	address() {
		this.navCtrl.push(AddressPage);
	}

	isReadonly() {
		return true;
	}
	addressNew() {
		this.navCtrl.push(AddressPage);
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
