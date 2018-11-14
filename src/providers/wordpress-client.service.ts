import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";

import { APP_CONFIG, AppConfig } from "../app/app.config";
import { NetworkError } from "../models/network-error.model";
import { Category } from "../models/category.models";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { RegisterRequest } from "../models/register-request.models";
import { RegisterResponse } from "../models/register-response.models";
import { UserResponse } from "../models/user-response.models";
import { Product } from "../models/product.models";
import { Review } from "../models/review.models";
import { PaymentGateway } from "../models/payment-gateway.models";
import { OrderRequest } from "../models/order-request.models";
import { OrderResponse } from "../models/order-response.models";
import { Order } from "../models/order.models";
import { ShippingLine } from "../models/shipping-line.models";
import { Currency } from "../models/currency.models";
import { OrderUpdateRequest } from "../models/order-update-request.models";
import { Coupon } from '../models/coupon.models';
import { Banner } from '../models/banner.models';
import { ResetPasswordResponse } from '../models/reset-password-response.models';

@Injectable()
export class WordpressClient {

	private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

	}

	public getUser(adminToken: string, userId: string): Observable<UserResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<UserResponse>(this.config.apiBase + 'wc/v2/customers/' + userId, { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public updateUser(adminToken: string, userId: string, userUpdateRequest: UserResponse): Observable<UserResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.put<UserResponse>(this.config.apiBase + 'wc/v2/customers/' + userId, JSON.stringify(userUpdateRequest), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public createUser(adminToken: string, credentials: RegisterRequest): Observable<RegisterResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.post<RegisterResponse>(this.config.apiBase + 'wp/v2/users', JSON.stringify(credentials), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public getAuthToken(credentials: AuthCredential): Observable<AuthResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http
			.post<AuthResponse>(this.config.apiBase + 'mobile-ecommerce/v1/jwt/token', JSON.stringify(credentials), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public resetPassword(userName: string): Observable<ResetPasswordResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http
			.post<ResetPasswordResponse>(this.config.apiBase + 'mobile-ecommerce/v1/password/forgot', JSON.stringify({ user_login: userName }), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public createOrder(adminToken: string, createOrder: OrderRequest): Observable<OrderResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.post<OrderResponse>(this.config.apiBase + 'wc/v2/orders/', JSON.stringify(createOrder), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public myOrders(adminToken: string, customer_id: string, pageNo: string): Observable<Array<Order>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Order>>(this.config.apiBase + 'wc/v2/orders/' + '?customer=' + customer_id + '&page=' + pageNo, { headers: myHeaders })
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let order = data[i];
					order.date_created = this.formatDate(new Date(order.date_created));
				}
				return Observable.of(data);
			});
	}

	public updateOrder(adminToken: string, orderId: string, orderUpdateRequest: any): Observable<Order> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.put<Order>(this.config.apiBase + 'wc/v2/orders/' + orderId, JSON.stringify(orderUpdateRequest), { headers: myHeaders })
			.concatMap(data => {
				let order = data;
				order.date_created = this.formatDate(new Date(order.date_created));
				return Observable.of(data);
			});
	}


	public shippingLines(adminToken: string): Observable<Array<ShippingLine>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<ShippingLine>>(this.config.apiBase + 'wc/v2/shipping_methods/', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public getCouponByCode(adminToken: string, cCode: string): Observable<Array<Coupon>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Coupon>>(this.config.apiBase + 'wc/v2/coupons?code=' + cCode, { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public applyCouponCode(adminToken: string, orderId: string, cCode: string): Observable<Order> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Order>(this.config.apiBase + 'mobile-ecommerce/v1/coupon/order/' + orderId + '/apply-coupon?code=' + cCode, { headers: myHeaders })
			.concatMap(data => {
				let order = data;
				order.date_created = this.formatDate(new Date(order.date_created));
				return Observable.of(data);
			});
	}

	public categories(adminToken: string, pageNo: string): Observable<Array<Category>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Category>>(this.config.apiBase + 'wc/v2/products/categories/?per_page=20&order=desc&orderby=count&page=' + pageNo + '&_embed', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productVariations(adminToken: string, productId: string): Observable<Array<Product>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Product>>(this.config.apiBase + 'wc/v2/products/' + productId + '/variations/', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productsReviews(adminToken: string, productId: string): Observable<Array<Review>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Review>>(this.config.apiBase + 'wc/v2/products/' + productId + '/reviews/', { headers: myHeaders })
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let review = data[i];
					review.date_created = this.formatDate(new Date(review.date_created));
				}
				return Observable.of(data);
			});
	}

	public banners(adminToken: string): Observable<Array<Banner>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Banner>>(this.config.apiBase + 'mobile-ecommerce/v1/banners/list', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productsAll(adminToken: string, pageNo: string): Observable<Array<Product>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Product>>(this.config.apiBase + 'wc/v2/products/' + '?per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productById(adminToken: string, proId: string): Observable<Product> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Product>(this.config.apiBase + 'wc/v2/products/' + proId, { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productsByQuery(adminToken: string, query: string, pageNo: string): Observable<Array<Product>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Product>>(this.config.apiBase + 'wc/v2/products/' + '?search=' + query + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public productsByCategory(adminToken: string, catId: string, pageNo: string): Observable<Array<Product>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<Product>>(this.config.apiBase + 'wc/v2/products/' + '?category=' + catId + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public currencies(adminToken: string): Observable<Currency> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Currency>(this.config.apiBase + 'wc/v2/settings/general/woocommerce_currency', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public paymentGateways(adminToken: string): Observable<Array<PaymentGateway>> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': adminToken });
		return this.http
			.get<Array<PaymentGateway>>(this.config.apiBase + 'wc/v2/payment_gateways/', { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	private formatDate(date: Date): string {
		return this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	}
}