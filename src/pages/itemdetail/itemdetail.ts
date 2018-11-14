import { Component } from '@angular/core';
import { NavController, AlertController, Loading, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { Global } from '../../providers/global';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { ShippiningPage } from '../shippining/shippining';
import { Product } from "../../models/product.models";
import { Review } from "../../models/review.models";
import { Constants } from "../../models/constants.models";
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserResponse } from '../../models/user-response.models';
import { LoginPage } from '../login/login';
import { Currency } from '../../models/currency.models';
import { Image } from '../../models/image.models';
import { ShirtsPage } from '../shirts/shirts';
import { CategoryPage } from '../category/category';

@Component({
	selector: 'page-itemdetail ',
	templateUrl: 'itemdetail.html',
	providers: [WordpressClient, Global]
})
export class ItemdetailPage {
	private loading: Loading;
	private loadingShown: Boolean = false;

	private subscriptions: Array<Subscription> = [];
	private product: Product;
	private details: boolean = false;
	private reviews: Array<Review>;
	private productsResponse = new Array<Product>();
	private productVariations = new Array<Product>();
	private imageToDisplay: string;
	private currencyIcon: string;
	private currencyText: string;

	constructor(private socialSharing: SocialSharing, public navCtrl: NavController, private toastCtrl: ToastController, public modalCtrl: ModalController, private global: Global, private navParams: NavParams, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.product = this.navParams.get('pro');
		if (this.product) {
			this.product.favorite = global.isFavorite(this.product);
			let productsResponse: Array<Product> = this.navParams.get('pros');
			for (let pro of productsResponse) {
				if (pro.id != this.product.id) {
					pro.favorite = global.isFavorite(pro);
					this.productsResponse.push(pro);
				}
			}
			if (this.product.images && this.product.images.length) {
				this.imageToDisplay = this.product.images[0].src;
			}
			this.loadReviews();
			if (this.product.type == 'variable') {
				this.loadVariations();
			}
		} else {
			this.loadProductById(this.navParams.get('pro_id'));
		}
	}

	loadProductById(proId) {
		this.presentLoading('loading product');
		let subscription: Subscription = this.service.productById(window.localStorage.getItem(Constants.ADMIN_API_KEY), proId).subscribe(data => {
			this.product = data;
			this.product.favorite = this.global.isFavorite(this.product);
			if (this.product.images && this.product.images.length) {
				this.imageToDisplay = this.product.images[0].src;
			}
			this.loadReviews();
			if (this.product.type == 'variable') {
				this.loadVariations();
			}
			this.dismissLoading();
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	loadVariations() {
		this.presentLoading('loading variations');
		let subscription: Subscription = this.service.productVariations(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.product.id).subscribe(data => {
			let variations: Array<Product> = data;
			for (let vari of variations) {
				let variAttris = '';
				for (let i = 0; i < vari.attributes.length; i++) {
					let attri = vari.attributes[i].name + ' ' + vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
					variAttris = variAttris + attri;
				}

				vari.name = this.product.name + ' - ' + variAttris;
				vari.type = 'variable';
				vari.images = new Array<Image>();
				vari.images.push(vari.image);

				if (!this.currencyText) {
					let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
					if (currency) {
						this.currencyText = currency.value;
						let iconText = currency.options[currency.value];
						this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
					}
				}
				if (!vari.sale_price) {
					vari.sale_price = vari.regular_price;
				}
				if (this.currencyIcon) {
					vari.regular_price_html = this.currencyIcon + ' ' + vari.regular_price;
					vari.sale_price_html = this.currencyIcon + ' ' + vari.sale_price;
				} else if (this.currencyText) {
					vari.regular_price_html = this.currencyText + ' ' + vari.regular_price;
					vari.sale_price_html = this.currencyText + ' ' + vari.sale_price;
				}
			}
			this.productVariations = variations;
			this.dismissLoading();
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	showImage(src) {
		this.imageToDisplay = src;
	}

	loadReviews() {
		let subscription: Subscription = this.service.productsReviews(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.product.id).subscribe(data => {
			let reviews: Array<Review> = data;
			let approved = new Array<Review>();
			for (let rev of reviews) {
				if (rev.verified) {
					approved.push(rev);
				}
			}
			this.reviews = approved;
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	viewMoreSimilar() {
		let cat = this.product && this.product.categories.length ? this.product.categories[0] : null;
		if (cat && cat.id != '-1') {
			this.navCtrl.push(ShirtsPage, { cat: cat });
		} else {
			this.navCtrl.push(CategoryPage);
		}
	}

	itemdetailPage(pro) {
		this.navCtrl.push(ItemdetailPage, { pro: pro, pros: this.productsResponse });
	}

	viewMore() {
		this.details = true;
	}

	viewLess() {
		this.details = false;
	}

	toggleFavorite(pro) {
		pro.favorite = this.global.toggleFavorite(pro);
	}

	shareProduct(pro) {
		this.socialSharing.share('Found this product on Mobimall', pro.name, null, pro.permalink).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
	}

	addVariation(variation) {
		if (variation.in_stock && variation.purchasable) {
			let added: boolean = this.global.addCartItem(variation);
			this.showToast(added ? 'Added in cart' : 'Updated in cart');
		} else {
			this.showToast('Item unavailable to buy.');
		}
	}
	buyVariation(variation) {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		if (user != null) {
			this.navCtrl.push(ShippiningPage, { pro: variation });
		} else {
			this.showToast('Sign in to continue');
			this.navCtrl.push(LoginPage);
		}
	}

	addToCart() {
		if (this.product.in_stock && this.product.purchasable) {
			let added: boolean = this.global.addCartItem(this.product);
			this.showToast(added ? 'Added in cart' : 'Updated in cart');
		} else {
			this.showToast('Item unavailable to buy.');
		}
	}

	buyNow() {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		if (user != null) {
			this.navCtrl.push(ShippiningPage, { pro: this.product });
		} else {
			this.showToast('Sign in to continue');
			this.navCtrl.push(LoginPage);
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

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.onDidDismiss(() => { this.global.refreshCartItems(); });
		modal.present();
	}
}
