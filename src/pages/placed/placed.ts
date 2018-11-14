import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { Myorder_2Page } from '../myorder_2/myorder_2';

@Component({
  selector: 'page-placed ',
  templateUrl: 'placed.html'
})
export class PlacedPage {
	
	constructor(public navCtrl: NavController) {}
	
	ordersPage() {
		this.homePage();
		this.navCtrl.push(Myorder_2Page);
	}
	
	homePage() {
		this.navCtrl.setRoot(HomePage);
	}

}
