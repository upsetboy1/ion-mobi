import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CreateaccountPage } from '../createaccount/createaccount';

@Component({
  selector: 'page-verification ',
  templateUrl: 'verification.html'
})
export class VerificationPage {

  constructor(public navCtrl: NavController) {

  }
   createaccountPage(){
    this.navCtrl.push(CreateaccountPage);
    }

}
