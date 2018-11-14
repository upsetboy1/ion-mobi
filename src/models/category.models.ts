import {Serializable} from "./serializalble.interface";
import {Image} from "./image.models";

export class Category {
	id: string;
	parent: string;
	name: string;
	description: string;
	count: string;
	slug: string;
	menu_order: string;
	image: Image;
	selected: boolean;
}