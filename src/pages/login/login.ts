import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, Events } from 'ionic-angular';

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { HomePage } from '../home/home';
import { PasswordPage } from '../password/password';
import { CreateaccountPage } from '../createaccount/createaccount';

import { AuthCredential } from "../../models/auth-credential.models";
import { AuthResponse } from "../../models/auth-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { Address } from '../../models/address.models';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [WordpressClient]
})
export class LoginPage {
	private loading: Loading;
	private loadingShown: Boolean = false;
	private authError = "";

	private subscriptions: Array<Subscription> = [];
	private credentials: AuthCredential = new AuthCredential('', '');

	constructor(private events: Events, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		if (this.userLoggedIn()) {
			navCtrl.setRoot(HomePage);
		}
	}

	private userLoggedIn(): boolean {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		return user != null;
	}

	singIn() {
		this.authError = "";
		if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
			this.showToast('Username or Password cannot be empty!');
		} else {
			this.presentLoading('Logging in');
			let subscription: Subscription = this.service.getAuthToken(this.credentials).subscribe(data => {
				let authResponse: AuthResponse = data;
				window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
				this.getUser(this.getUserIdFromToken(authResponse.token));
			}, err => {
				this.authError = err.error.message;
				console.log(this.authError);
				let pos = this.authError.indexOf('<a');
				if (pos != -1) {
					this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
				}
				console.log(this.authError);
				this.dismissLoading();
				//this.presentErrorAlert("Unable to login with provided credentials");
			});
			this.subscriptions.push(subscription);
		}
	}

	private getUser(userId: string) {
		let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
			this.dismissLoading();
			let userResponse: UserResponse = data;
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
			if (userResponse.billing) {
				userResponse.billing.id = -100;
				let addresses = new Array<Address>();
				addresses.push(userResponse.billing);
				window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
				window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
			}
			this.navCtrl.setRoot(HomePage);
			this.events.publish('user:login');
		}, err => {
			this.dismissLoading();
			this.presentErrorAlert("Unable to login with provided credentials");
		});
		this.subscriptions.push(subscription);
	}

	private getUserIdFromToken(token: string): string {
		let decodedString: string = window.atob(token.split(".")[1]);
		return JSON.parse(decodedString).data.user.id;
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

	signupPage() {
		this.navCtrl.push(CreateaccountPage);
	}

	homePage() {
		this.navCtrl.setRoot(HomePage);
	}

	passwordPage() {
		this.navCtrl.push(PasswordPage);
	}

}
