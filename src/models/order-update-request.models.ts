import {Serializable} from "./serializalble.interface";

export class OrderUpdateRequest {
	status:string;
	
	constructor(status: string) {
        this.status = status;
    }
}