import { Serializable } from "./serializalble.interface";
import { Address } from "./address.models";

export class UserResponse {
	id: number
	date_created: string
	date_modified: string
	first_name: string
	last_name: string
	email: string
	role: string
	username: string
	avatar_url: string
	billing: Address;
	shipping: Address;
}