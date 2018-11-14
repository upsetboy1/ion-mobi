import { Serializable } from "./serializalble.interface";

export class CouponLine {
    id: number;
    code: string;
    discount: string;
    discount_tax: string;

    constructor(id: number, code: string, discount: string, discount_tax: string) {
        this.id = id;
        this.code = code;
        this.discount = discount;
        this.discount_tax = discount_tax;
    }
}