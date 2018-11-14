import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { APP_CONFIG, BaseAppConfig } from "./app.config";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PhonenumberPage } from '../pages/phonenumber/phonenumber';
import { PasswordPage } from '../pages/password/password';
import { VerificationPage } from '../pages/verification/verification';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { CategoryPage } from '../pages/category/category';
import { ShirtsPage } from '../pages/shirts/shirts';
import { ItemdetailPage } from '../pages/itemdetail/itemdetail';
import { ShippiningPage } from '../pages/shippining/shippining';
import { PaymentPage } from '../pages/payment/payment';
import { PlacedPage } from '../pages/placed/placed';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { CodePage } from '../pages/code/code';
import { ReviewPage } from '../pages/review/review';
import { ShortPage } from '../pages/short/short';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { SearchPage } from '../pages/search/search';
import { FilterPage } from '../pages/filter/filter';
import { LoginPage } from '../pages/login/login';
import { AddressPage } from '../pages/address/address';
import { PayPal } from '@ionic-native/paypal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MySplashPage } from '../pages/mysplash/mysplash';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PhonenumberPage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    ShirtsPage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    Myorder_2Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PhonenumberPage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    ShirtsPage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    Myorder_2Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PayPal,
    SocialSharing,
    InAppBrowser,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
