import {Serializable} from "./serializalble.interface";
import {Address} from "./address.models";
import {CartItem} from "./cart-item.models";
import {ShippingLine} from "./shipping-line.models";
import { CouponLine } from "./coupon-line.models";

export class OrderRequest {
	payment_method: string;
	payment_method_title: string;
	customer_id: string;
    set_paid: boolean;
    billing: Address;
    shipping: Address;
    line_items: Array<CartItem>;
    shipping_lines: Array<ShippingLine>;
}