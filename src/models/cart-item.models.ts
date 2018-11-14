import { Serializable } from "./serializalble.interface";
import { Product } from "./product.models";

export class CartItem {
	product_id: string
	quantity: number
	product: Product
}