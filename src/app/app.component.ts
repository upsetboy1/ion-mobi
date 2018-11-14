import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { LoginPage } from '../pages/login/login';
import { CategoryPage } from '../pages/category/category';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { ReviewPage } from '../pages/review/review';

import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { Constants } from "../models/constants.models";
import { Category } from "../models/category.models";
import { PaymentGateway } from "../models/payment-gateway.models";
import { ShippingLine } from "../models/shipping-line.models";
import { UserResponse } from "../models/user-response.models";
import { Currency } from "../models/currency.models";
import { APP_CONFIG, AppConfig } from "./app.config";
import { MySplashPage } from '../pages/mysplash/mysplash';

@Component({
	templateUrl: 'app.html',
	providers: [WordpressClient]
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	private subscriptions: Array<Subscription> = [];

	rootPage: any = MySplashPage;
	pages: Array<{ title: string, component: any }>;
	pageCategory: number = 1;
	categoriesAll = new Array<Category>();
	user: UserResponse;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private events: Events, private alertCtrl: AlertController, private service: WordpressClient, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
		let superAuth = "";
		if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
			superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
			window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
			this.onSuperAuthSetup(superAuth);
		} else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
			let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
				let authResponse: AuthResponse = data;
				superAuth = ("Bearer " + authResponse.token);
				window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
				this.onSuperAuthSetup(superAuth);
			}, err => {
				console.log('auth setup error');
			});
			this.subscriptions.push(subscription);
		} else {
			console.log('auth setup error');
		}

		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));

		this.initializeApp();
		this.listenToLoginEvents();
	}

	onSuperAuthSetup(superAuth) {
		console.log('auth setup success: ' + superAuth);
		this.loadCategories();
		this.loadCurrency();
		this.loadPaymentGateways();
		this.loadShippingLines();
	}

	listenToLoginEvents() {
		this.events.subscribe('user:login', () => {
			this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		});
	}

	loadCurrency() {
		let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let currency: Currency = data;
			window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
			console.log('currency setup success');
		}, err => {
			console.log('currency setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadShippingLines() {
		let subscription: Subscription = this.service.shippingLines(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let shippingLines: Array<ShippingLine> = data;
			window.localStorage.setItem(Constants.SHIPPING_LINES, JSON.stringify(shippingLines));
			console.log('shippingLines setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadPaymentGateways() {
		let subscription: Subscription = this.service.paymentGateways(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let paymentGateway: Array<PaymentGateway> = data;
			window.localStorage.setItem(Constants.PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
			console.log('payment-gateway setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadCategories() {
		let subscription: Subscription = this.service.categories(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.pageCategory)).subscribe(data => {
			let categories: Array<Category> = data;
			if (categories.length == 0) {
				window.localStorage.setItem(Constants.PRODUCT_CATEGORIES, JSON.stringify(this.categoriesAll));
				console.log('categories setup success');
				this.events.publish('category:setup');
			} else {
				this.categoriesAll = this.categoriesAll.concat(categories);
				this.pageCategory++;
				this.loadCategories();
			}
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	addressPage() {
		this.nav.setRoot(AddressSelectPage);
	}

	myorder_1Page() {
		this.nav.setRoot(Myorder_2Page);
	}

	myorder_2Page() {
		this.nav.setRoot(Myorder_2Page);
	}

	my_accountPage() {
		this.nav.setRoot(My_accountPage);
	}

	categoryPage() {
		this.nav.setRoot(CategoryPage);
	}

	homePage() {
		this.nav.setRoot(HomePage);
	}

	reviewPage() {
		this.nav.setRoot(ReviewPage);
	}

	wishlistPage() {
		this.nav.setRoot(WishlistPage);
	}

	cartPage() {
		this.nav.setRoot(CartPage);
	}

	helpPage() {
		this.nav.setRoot(HelpPage);
	}

	categoriesPage() {
		this.nav.setRoot(CategoryPage);
	}

	actionNavHeader() {
		if (this.user) {
			this.nav.setRoot(My_accountPage);
		} else {
			this.nav.push(LoginPage);
		}
	}

	phonenumberPage() {
		let alert = this.alertCtrl.create({
			title: 'Logout',
			message: 'Are you sure you want to logout?',
			buttons: [{
				text: 'No',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			},
			{
				text: 'Yes',
				handler: () => {
					window.localStorage.setItem(Constants.USER_KEY, null);
					this.nav.setRoot(LoginPage);
				}
			}]
		});
		alert.present();
	}
}
