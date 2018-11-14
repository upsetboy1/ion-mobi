import {Serializable} from "./serializalble.interface";

export class AuthCredential {
	username: string;
	password: string;
	
	constructor(username: string, password: string) {
        this.username = username;
		this.password = password;
    }
}