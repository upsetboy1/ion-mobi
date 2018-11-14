import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PaymentPage } from '../payment/payment';
import { CodePage } from '../code/code';
import { AddressSelectPage } from '../addressselect/addressselect';
import { Product } from "../../models/product.models";
import { Global } from '../../providers/global';
import { Address } from "../../models/address.models";
import { Constants } from "../../models/constants.models";
import { CartItem } from "../../models/cart-item.models";
import { Currency } from "../../models/currency.models";
import { Coupon } from '../../models/coupon.models';


@Component({
	selector: 'page-shippining ',
	templateUrl: 'shippining.html',
	providers: [Global]
})

export class ShippiningPage {
	private cartItems: Array<CartItem>;
	private selectedAddress: Address;
	private editMainCart: boolean = false;
	private total: number = 0;
	private total_items = 0;
	private total_items_html: string = '0';
	private total_html: string = '0';
	private deliveryPayble: string = '0';
	private couponAmount: string = '0';
	private addressChangeText = 'Change';
	private currencyIcon: string = '';
	private currencyText: string = '';
	private coupon: Coupon;

	constructor(public modalCtrl: ModalController, public navCtrl: NavController, private navParams: NavParams, private global: Global, private toastCtrl: ToastController) {
		let product: Product = this.navParams.get('pro');
		if (product == null) {
			this.cartItems = global.getCartItems();
			this.editMainCart = true;
		} else {
			let cartItems = new Array<CartItem>();
			let cartItem = new CartItem();
			cartItem.product = product;
			cartItem.product_id = product.id;
			cartItem.quantity = 1;
			cartItems.push(cartItem);
			this.cartItems = cartItems;
		}
		let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (currency) {
			this.currencyText = currency.value;
			let iconText = currency.options[currency.value];
			this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
		}
		this.deliveryPayble = this.currencyIcon + ' ' + this.deliveryPayble;
		this.calculateTotal();
		window.localStorage.removeItem(Constants.SELECTED_COUPON);
	}

	ionViewDidEnter() {
		this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
		this.addressChangeText = this.selectedAddress == null ? 'Add' : 'Change';
	}

	addressPage() {
		this.navCtrl.push(AddressSelectPage, { action: 'choose' });
	}

	removeItem(product) {
		if (this.editMainCart) {
			this.global.removeCartItem(product);
			this.cartItems = this.global.getCartItems();
			this.calculateTotal();
		} else {
			let pos: number = -1;
			for (let i = 0; i < this.cartItems.length; i++) {
				if (product.id == this.cartItems[i].product_id) {
					pos = i;
					break;
				}
			}
			if (pos != -1) {
				this.cartItems.splice(pos, 1);
				this.cartItems = this.cartItems;
			}
		}

		if (this.cartItems.length == 0) {
			this.navCtrl.pop();
		}
	}

	decrementItem(product) {
		if (this.editMainCart) {
			var decremented: boolean = this.global.decrementCartItem(product);
			if (!decremented) {
				this.cartItems = this.global.getCartItems();
				this.calculateTotal();
			} else {
				this.total_items_html = this.currencyIcon + ' ' + (this.total - Number(product.sale_price));
			}
		} else {
			let pos: number = -1;
			for (let i = 0; i < this.cartItems.length; i++) {
				if (product.id == this.cartItems[i].product_id) {
					pos = i;
					break;
				}
			}
			if (pos != -1) {
				if (this.cartItems[pos].quantity > 1) {
					this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
					this.cartItems = this.cartItems;
				} else {
					this.cartItems.splice(pos, 1);
					this.cartItems = this.cartItems;
				}
				this.calculateTotal();
			}
		}

		if (this.cartItems.length == 0) {
			this.navCtrl.pop();
		}
	}

	incrementItem(product) {
		if (this.editMainCart) {
			var incremented: boolean = this.global.incrementCartItem(product);
			if (incremented) {
				this.calculateTotal();
			}
		} else {
			let pos: number = -1;
			for (let i = 0; i < this.cartItems.length; i++) {
				if (product.id == this.cartItems[i].product_id) {
					pos = i;
					break;
				}
			}
			if (pos != -1) {
				this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
				this.cartItems = this.cartItems;
				this.calculateTotal();
			}
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

	calculateTotal() {
		let sum: number = 0;
		for (let item of this.cartItems) {
			sum = sum + Number(item.product.sale_price) * item.quantity;
		}
		this.total_items = sum;
		this.total = (sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0));
		this.total_items_html = this.currencyIcon + ' ' + this.total_items;
		this.total_html = this.currencyIcon + ' ' + this.total;
	}

	paymentPage() {
		if (this.selectedAddress == null) {
			this.showToast('Please select an address.');
		} else {
			if (!this.coupon) {
				window.localStorage.removeItem(Constants.SELECTED_COUPON);
			}
			this.navCtrl.push(PaymentPage, { cart: this.cartItems, totalItems: this.total_items, total: this.total });
		}
	}

	codePage() {
		let modal = this.modalCtrl.create(CodePage);
		modal.onDidDismiss(() => {
			let coupon: Coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
			if (coupon) {
				if (coupon.discount_type == 'fixed_product') {
					let allowed = false;
					for (let itemCA of coupon.product_ids) {
						for (let item of this.cartItems) {
							if (itemCA == Number(item.product_id)) {
								allowed = true;
								break;
							}
						}
						if (allowed) { break; }
					}
					if (allowed) {
						this.coupon = coupon;
						this.couponAmount = this.currencyIcon + ' ' + this.coupon.amount + (this.coupon.discount_type == 'percent' ? '%' : '');
						this.calculateTotal();
					}
				} else {
					this.coupon = coupon;
					this.couponAmount = this.currencyIcon + ' ' + this.coupon.amount + (this.coupon.discount_type == 'percent' ? '%' : '');
					this.calculateTotal();
				}
			}
		});
		modal.present();
	}

	goBack() {
		this.navCtrl.pop();
	}

}
