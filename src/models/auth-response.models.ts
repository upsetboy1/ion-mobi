import {Serializable} from "./serializalble.interface";

export class AuthResponse {
	token: string;
	user_email: string;
	user_nicename: string;
	user_display_name: string;
}