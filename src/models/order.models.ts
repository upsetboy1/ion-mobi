import {Serializable} from "./serializalble.interface";
import {Address} from "./address.models";
import {LineItem} from "./line-item.models";
import {ShippingLine} from "./shipping-line.models";

export class Order {
	id: number;
	customer_id: number;
	order_key: string;
	number: string;
	currency: string;
	status: string;
	date_created: string;
	payment_method: string;
	payment_method_title: string;
	transaction_id: string;
	total: number;
	discount_total: number;
	shipping_total: number;
    prices_include_tax: boolean;
    billing: Address;
    shipping: Address;
    line_items: Array<LineItem>;
}