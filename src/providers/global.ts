import { Injectable, Inject } from '@angular/core';
import { Product } from "../models/product.models";
import { CartItem } from "../models/cart-item.models";


@Injectable()
export class Global {
	private favorites: Array<Product>;
	private cartItems: Array<CartItem>;
	private searchHistory: Array<string>;

	constructor() {
	}

	decrementCartItem(pro): boolean {
		this.checkCartItems();
		let decrement: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (pro.id == this.cartItems[i].product_id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			if (this.cartItems[pos].quantity > 1) {
				this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
				decrement = true;
			} else {
				this.cartItems.splice(pos, 1);
			}
			window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
		}
		return decrement;
	}

	incrementCartItem(pro): boolean {
		this.checkCartItems();
		let increment: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (pro.id == this.cartItems[i].product_id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
			increment = true;
			window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
		}
		return increment;
	}

	removeCartItem(pro): boolean {
		this.checkCartItems();
		let removed: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (pro.id == this.cartItems[i].product_id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems.splice(pos, 1);
			window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
			removed = true;
		}
		return removed;
	}

	addCartItem(pro): boolean {
		this.checkCartItems();
		let added: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (pro.id == this.cartItems[i].product_id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
		} else {
			let cartItem = new CartItem();
			cartItem.product = pro;
			cartItem.product_id = pro.id;
			cartItem.quantity = 1;

			this.cartItems.push(cartItem);
			added = true;
		}
		console.log(this.cartItems);
		window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
		return added;
	}

	toggleFavorite(pro): boolean {
		this.checkFavorites();
		let toggleResult: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.favorites.length; i++) {
			if (pro.id == this.favorites[i].id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.favorites.splice(pos, 1);
			window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
			console.log('saving remove');
			toggleResult = false;
		} else {
			this.favorites.push(pro);
			window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
			console.log('saving save');
			toggleResult = true;
		}
		return toggleResult;
	}

	removeFavorite(pro): boolean {
		this.checkFavorites();
		let removed: boolean = false;
		let pos: number = -1;
		for (let i = 0; i < this.favorites.length; i++) {
			if (pro.id == this.favorites[i].id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.favorites.splice(pos, 1);
			window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
			removed = true;
		}
		return removed;
	}

	isFavorite(pro): boolean {
		this.checkFavorites();
		let fav: boolean = false;
		for (let product of this.favorites) {
			if (pro.id == product.id) {
				fav = true;
				break;
			}
		}
		return fav;
	}

	addInSearchHistory(query: string) {
		this.checkSearchHistory();
		let index: number = this.searchHistory.indexOf(query);
		if (index == -1) {
			if (this.searchHistory.length == 5) {
				this.searchHistory.splice(0, 1);
			}
			this.searchHistory.push(query);
			window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
		}
	}

	clearCart() {
		this.cartItems = new Array<CartItem>();
		window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
	}

	clearSearchHistory() {
		this.searchHistory = new Array<string>();
		window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
	}

	checkCartItems() {
		if (this.cartItems == null) {
			let cartItems: Array<CartItem> = JSON.parse(window.localStorage.getItem('cartItems'));
			if (cartItems != null) {
				this.cartItems = cartItems;
			} else {
				this.cartItems = new Array<CartItem>();
			}
		}
	}

	checkFavorites() {
		if (this.favorites == null) {
			let favProducts: Array<Product> = JSON.parse(window.localStorage.getItem('favoriteProducts'));
			if (favProducts != null) {
				this.favorites = favProducts;
			} else {
				this.favorites = new Array<Product>();
			}
		}
	}

	checkSearchHistory() {
		if (this.searchHistory == null) {
			let history: Array<string> = JSON.parse(window.localStorage.getItem('searchHistory'));
			if (history != null) {
				this.searchHistory = history;
			} else {
				this.searchHistory = new Array<string>();
			}
		}
	}

	refreshCartItems() {
		let cartItems: Array<CartItem> = JSON.parse(window.localStorage.getItem('cartItems'));
		if (cartItems != null) {
			this.cartItems = cartItems;
		} else {
			this.cartItems = new Array<CartItem>();
		}
	}

	getSearchHistory() {
		this.checkSearchHistory();
		return this.searchHistory;
	}

	getFavorites() {
		this.checkFavorites();
		return this.favorites;
	}

	getCartItems() {
		this.checkCartItems();
		return this.cartItems;
	}

}