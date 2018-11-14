import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PasswordPage } from '../password/password';
@Component({
  selector: 'page-phonenumber ',
  templateUrl: 'phonenumber.html'
})
export class PhonenumberPage {

  constructor(public navCtrl: NavController) {

  }
  
    homePage(){
    this.navCtrl.push(HomePage);
    }
    passwordPage(){
    this.navCtrl.push(PasswordPage);
    }
}
