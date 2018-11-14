import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
	appName: string;
	apiBase: string;
	perPage: string;
	consumerKey: string;
	consumerSecret: string;
	adminUsername: string;
	adminPassword: string;
	paypalSandbox: string;
	paypalProduction: string;
	payuSalt: string;
	payuKey: string;
}

export const BaseAppConfig: AppConfig = {
	appName: "MOBIMALL",
	apiBase: "http://yourdomain.com/wp-json/",
	perPage: "5",
	consumerKey: "",
	consumerSecret: "",
	adminUsername: "",
	adminPassword: "",
	paypalSandbox: "",
	paypalProduction: "",
	payuSalt: "",
	payuKey: ""
};