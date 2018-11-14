import { Component } from '@angular/core';
import { NavController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { VerificationPage } from '../verification/verification';
import { LoginPage } from '../login/login';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';

@Component({
	selector: 'page-password ',
	templateUrl: 'password.html',
	providers: [WordpressClient]
})
export class PasswordPage {
	private userLogin: string;
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];

	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController) {

	}

	resetPassword() {
		if (this.userLogin && this.userLogin.length) {
			this.presentLoading('Initiating reset email request.');
			let subscription: Subscription = this.service.resetPassword(this.userLogin).subscribe(data => {
				this.dismissLoading();
				this.navCtrl.pop();
			}, err => {
				this.dismissLoading();
				this.navCtrl.pop();
			});
			this.subscriptions.push(subscription);
		} else {
			this.showToast('Enter valid username');
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

}
