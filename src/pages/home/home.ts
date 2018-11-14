import { Component, Inject } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, MenuController, ModalController } from 'ionic-angular';

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Global } from '../../providers/global';
import { Subscription } from "rxjs/Subscription";

import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { ItemdetailPage } from '../itemdetail/itemdetail';
import { ShirtsPage } from '../shirts/shirts';
import { Category } from "../../models/category.models";
import { Product } from "../../models/product.models";
import { Constants } from "../../models/constants.models";
import { Currency } from "../../models/currency.models";
import { Banner } from '../../models/banner.models';
import { JsonpCallbackContext } from '../../../node_modules/@angular/common/http/src/jsonp';
import { AppConfig, APP_CONFIG } from '../../app/app.config';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [WordpressClient, Global]
})
export class HomePage {
	private loading: Loading;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private banners = new Array<Banner>();
	private categoriesAll = new Array<Category>();
	private productsAll = new Array<Array<Product>>();
	private productsResponse = new Array<Product>();
	private productsAllPage: number = 1;
	private currencyIcon: string;
	private currencyText: string;
	private appTitle;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, public modalCtrl: ModalController, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, public menu: MenuController, private global: Global, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.appTitle = config.appName;
		let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
		let cats = new Array<Category>();
		for (let cat of categories) {
			if (cats.length == 4) {
				break;
			}
			if (Number(cat.parent) == 0) {
				cats.push(cat);
			}
		}
		let more = new Category();
		more.name = 'More';
		more.id = '-1';
		cats.push(more);
		this.categoriesAll = cats;

		this.loadBanners();
		this.loadProducts();
		this.presentLoading('loading products');
	}

	ionViewWillLeave() {
		window.localStorage.setItem('productsAll', JSON.stringify(this.productsAll));
	}

	ionViewDidEnter() {
		this.menu.enable(true);
		this.productsAll = JSON.parse(window.localStorage.getItem('productsAll'));
		if (!this.productsAll) {
			this.productsAll = new Array<Array<Product>>();
		} else {
			this.dismissLoading();
		}
	}

	loadBanners() {
		let savedBanners: Array<Banner> = JSON.parse(window.localStorage.getItem('banners'));
		if (savedBanners && savedBanners.length) {
			this.banners = savedBanners;
		}
		let subscription: Subscription = this.service.banners(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let banners: Array<Banner> = data;
			let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
			for (let ban of banners) {
				for (let cat of categories) {
					if (cat.id == ban.category) {
						ban.catObj = cat;
						break;
					}
				}
			}
			this.banners = banners;
			window.localStorage.setItem('banners', JSON.stringify(this.banners));
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	loadProducts() {
		let subscription: Subscription = this.service.productsAll(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.productsAllPage)).subscribe(data => {
			this.dismissLoading();
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
				pro.favorite = this.global.isFavorite(pro);
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
				proSplit.push(pro);
			}
			if (proSplit.length > 0) {
				productsAll.push(proSplit);
			}
			this.productsAll = productsAll;
		}, err => {
			this.dismissLoading();
		});
		this.subscriptions.push(subscription);
	}

	doInfinite(infiniteScroll: any) {
		this.productsAllPage++;
		let subscription: Subscription = this.service.productsAll(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.productsAllPage)).subscribe(data => {
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

	toggleFavorite(pro) {
		pro.favorite = this.global.toggleFavorite(pro);
	}

	itemdetailPage(pro) {
		this.navCtrl.push(ItemdetailPage, { pro: pro, pros: this.productsResponse });
	}

	categoryPage(cat) {
		if (cat && cat.id != '-1') {
			this.navCtrl.push(ShirtsPage, { cat: cat });
		} else {
			this.navCtrl.push(CategoryPage);
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

	slides = [
		{
			title: "Under Rs. 699",
			description: "Tops & Tunics",
			smalltext: "fashion wear of the weeks",
			image: "assets/imgs/slider-1.jpg",
		},
		{
			title: "Under Rs. 699",
			description: "Tops & Tunics",
			smalltext: "fashion wear of the weeks",
			image: "assets/imgs/slider-2.jpg",
		},
		{
			title: "Under Rs. 699",
			description: "Tops & Tunics",
			smalltext: "fashion wear of the weeks",
			image: "assets/imgs/slider-3.jpg",
		}
	];
	wishlistPage() {
		this.navCtrl.push(WishlistPage);
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
