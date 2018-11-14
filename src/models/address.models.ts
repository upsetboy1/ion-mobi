import {Serializable} from "./serializalble.interface";

export class Address {
	id: number;
	first_name: string;
    last_name: string;
	email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}