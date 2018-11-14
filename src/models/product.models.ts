import { Category } from "./category.models";
import { Serializable } from "./serializalble.interface";
import { Image } from "./image.models";
import { ProductAttribute } from "./product-attribute.models";

export class Product {
	id: string;
	name: string;
	slug: string;
	permalink: string;
	description: string;
	short_description: string;
	sku: string;
	type: string;
	price: string;
	price_html: string;
	regular_price: string;
	sale_price: string;
	regular_price_html: string;
	sale_price_html: string;
	date_on_sale_from: string;
	date_on_sale_to: string;
	total_sales: string;
	on_sale: string;
	purchasable: boolean;
	in_stock: boolean;
	shipping_required: boolean;
	shipping_taxable: boolean;
	favorite: boolean;
	shipping_class: string;
	shipping_class_id: string;
	stock_quantity: string;
	average_rating: string;
	rating_count: string;
	categories: Array<Category>;
	images: Array<Image>;
	image: Image;
	attributes: Array<ProductAttribute>;
}