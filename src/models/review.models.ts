import { Serializable } from "./serializalble.interface";

export class Review {
	id: string;
	date_created: string;
	review: string;
	rating: string;
	name: string;
	email: string;
	verified: boolean;
}