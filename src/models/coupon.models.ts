import { Serializable } from "./serializalble.interface";

export class Coupon {
    id: number;
    code: string;
    amount: string;
    date_expires: string;
    discount_type: string; //Options: percent, fixed_cart and fixed_product.
    usage_count: number;
    usage_limit: number;
    individual_use: boolean;
    product_ids: Array<number>;
    excluded_product_ids: Array<number>;
}