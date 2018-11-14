import {Serializable} from "./serializalble.interface";

export class PaymentGateway {
	id: string;
    title: string;
    description: string;
    order: number;
    enabled: boolean;
    method_title: string;
    method_description: string;
}