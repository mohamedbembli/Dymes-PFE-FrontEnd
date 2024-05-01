import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashbordComponent } from './admin-dashbord/admin-dashbord.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AttributesComponent } from './attributes/attributes.component';
import { BasketComponent } from './basket/basket.component';
import { CategoryShopComponent } from './category-shop/category-shop.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FavoriteListComponent } from './favorite-list/favorite-list.component';
import { ForgotPassAdminComponent } from './forgot-pass-admin/forgot-pass-admin.component';
import { ForgotPassClientComponent } from './forgot-pass-client/forgot-pass-client.component';
import { AuthenticationAdminGuard } from './guards/authentication-admin.guard';
import { AuthentificationClientGuardGuard } from './guards/authentification-client-guard.guard';
import { HomeComponent } from './home/home.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';
import { UpsellShoppingComponent } from './upsell-shopping/upsell-shopping.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'favorites', component: FavoriteListComponent},
  {path: 'cart', component: BasketComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'product-details/:id', component: ProductDetailsComponent },
  {path: 'product-category/:name', component: CategoryShopComponent},
  {path: 'product-category/:name/:searchTerm', component: CategoryShopComponent},
  {path: 'orderConfirmation/:id', component: OrderConfirmationComponent},
  {path: 'OfferOrderConfirmation/:idPreviousOrder/:idUpsellOrder', component: OrderConfirmationComponent},
  {path: 'specialOffer/:id/:orderid', component: UpsellShoppingComponent},
  {path: 'forgotUsrPassword', component: ForgotPassClientComponent},
  {path: 'forgotPassword', component: ForgotPassAdminComponent},
  {path: 'loginAdm', component: AdminLoginComponent},
  {path: 'loginUsr', component: UserLoginComponent},
  {path: 'myaccount', component: UserDashboardComponent,canActivate:[AuthentificationClientGuardGuard]},
  {path: 'admin', component: AdminDashbordComponent, canActivate:[AuthenticationAdminGuard]},
  {path: 'admin/settings', component:ProfilAdminComponent, canActivate:[AuthenticationAdminGuard]},
  {path: 'admin/catalogue/attributes', component:AttributesComponent, canActivate:[AuthenticationAdminGuard]},
  {path: '**', component: HomeComponent }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
