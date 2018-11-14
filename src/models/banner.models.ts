import {Serializable} from "./serializalble.interface";
import { Category } from "./category.models";

export class Banner {
	img_src: string;
    category: string;
    catObj: Category;
}