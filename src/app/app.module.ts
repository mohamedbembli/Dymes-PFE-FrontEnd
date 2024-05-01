import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashbordComponent } from './admin-dashbord/admin-dashbord.component';
import { HomeComponent } from './home/home.component';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DialogConfirmPassAdminComponent } from './dialog-confirm-pass-admin/dialog-confirm-pass-admin.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { ForgotPassAdminComponent } from './forgot-pass-admin/forgot-pass-admin.component';
import { EmployeesComponent } from './employees/employees.component';
import { DialogAddEmployeeComponent } from './dialog-add-employee/dialog-add-employee.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { DialogAddCategoryProductComponent } from './dialog-add-category-product/dialog-add-category-product.component';
import { ProductComponent } from './product/product.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DialogAddAttributeComponent } from './dialog-add-attribute/dialog-add-attribute.component';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogAddElementComponent } from './dialog-add-element/dialog-add-element.component';
import { DialogAddProductComponent } from './dialog-add-product/dialog-add-product.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PromotionComponent } from './promotion/promotion.component';
import { DialogAddPromotionComponent } from './dialog-add-promotion/dialog-add-promotion.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { UpsellComponent } from './upsell/upsell.component';
import { DialogAddUpsellComponent } from './dialog-add-upsell/dialog-add-upsell.component';
import { SettingsComponent } from './settings/settings.component';
import { StoreComponent } from './store/store.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DialogShippingFeesComponent } from './dialog-shipping-fees/dialog-shipping-fees.component';
import { OrderLifeCycleComponent } from './order-life-cycle/order-life-cycle.component';
import { DialogOrderLifeCycleStepComponent } from './dialog-order-life-cycle-step/dialog-order-life-cycle-step.component'

import {MatTableModule} from '@angular/material/table';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { CheckoutConfigurationComponent } from './checkout-configuration/checkout-configuration.component';

import { SwiperModule } from 'swiper/angular';
import { FavoriteListComponent } from './favorite-list/favorite-list.component';
import { HeaderStoreComponent } from './header-store/header-store.component';
import { FooterStoreComponent } from './footer-store/footer-store.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import { ButtonModule } from 'primeng/button';
import { StatisticModuleComponent } from './statistic-module/statistic-module.component';
import { OrdersComponent } from './orders/orders.component';
import { BasketComponent } from './basket/basket.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StockComponent } from './stock/stock.component';
import { FastCheckoutDialogComponent } from './fast-checkout-dialog/fast-checkout-dialog.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserAddressDialogComponent } from './user-address-dialog/user-address-dialog.component';
import { ClientsComponent } from './clients/clients.component';
import { CategoryShopComponent } from './category-shop/category-shop.component';
import { AddRatingDialogComponent } from './add-rating-dialog/add-rating-dialog.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { RatingComponent } from './rating/rating.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { UpsellShoppingComponent } from './upsell-shopping/upsell-shopping.component';
import { ForgotPassClientComponent } from './forgot-pass-client/forgot-pass-client.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClientAddClaimDialogComponent } from './client-add-claim-dialog/client-add-claim-dialog.component';

import {CarouselModule} from 'primeng/carousel';
import { ChangeOrderStatusDialogComponent } from './change-order-status-dialog/change-order-status-dialog.component';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminDashbordComponent,
    HomeComponent,
    ProfilAdminComponent,
    UserLoginComponent,
    DialogConfirmPassAdminComponent,
    ForgotPassAdminComponent,
    EmployeesComponent,
    DialogAddEmployeeComponent,
    ProductCategoryComponent,
    DialogAddCategoryProductComponent,
    ProductComponent,
    AttributesComponent,
    DialogAddAttributeComponent,
    DialogAddElementComponent,
    DialogAddProductComponent,
    PromotionComponent,
    DialogAddPromotionComponent,
    UpsellComponent,
    DialogAddUpsellComponent,
    SettingsComponent,
    StoreComponent,
    DialogShippingFeesComponent,
    OrderLifeCycleComponent,
    DialogOrderLifeCycleStepComponent,
    CheckoutConfigurationComponent,
    FavoriteListComponent,
    HeaderStoreComponent,
    FooterStoreComponent,
    ProductDetailsComponent,
    StatisticModuleComponent,
    OrdersComponent,
    BasketComponent,
    CheckoutComponent,
    StockComponent,
    FastCheckoutDialogComponent,
    UserDashboardComponent,
    UserAddressDialogComponent,
    ClientsComponent,
    CategoryShopComponent,
    AddRatingDialogComponent,
    RatingComponent,
    OrderConfirmationComponent,
    UpsellShoppingComponent,
    ForgotPassClientComponent,
    ClaimsComponent,
    ClientAddClaimDialogComponent,
    ChangeOrderStatusDialogComponent,
    LoadingComponent,
    ],
  imports: [
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonModule,
    CarouselModule,
    AccordionModule,
    SwiperModule,
    DragDropModule,
    MatTableModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    AngularEditorModule,
    NgbCollapseModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
