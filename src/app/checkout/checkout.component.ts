import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BasketService } from '../services/basket.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutHome:any=true;
  loadingPage:any=false;

  up:any;
  connectedUser:any=null;
  isShippingAdresseSet:any=false;
  isDefaultAdressChecked: boolean = false;


  phone:any=null;
  firstName:any=null;
  lastName:any=null;
  address:any=null;
  city:any=null;
  zipCode:any=null;

  errorMSG: string | null = null;

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;

  basketProducts: any[] = [];

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  totalPrices: { total: number, qte:any, id: any, name: any, type: any, description:any }[] = [];
  totalWithTax:any = 0;
  shippingFees:any = 0;

  isPromoCodeSet:any;
  promotion:any;

  storeData:any;
  paymentType:any;

  checkoutForm!: FormGroup;
  checkoutFieldsData: any;
  createAccount:any=false;

  constructor(private fb: FormBuilder, private router: Router, private basketService:BasketService, private authService: AuthService, private clientService: ClientService) { 

  }

  ngOnInit(): void {
    this.loadCheckoutFieldsData();
    this.loadStoreData();
    this.basketProducts = JSON.parse(localStorage.getItem('basketProducts') || '[]') as string[];
    this.totalPrices = this.basketService.getTotalPrices();
    this.totalWithTax = this.basketService.getTotalWithTax();
    this.shippingFees = this.basketService.getShippingFees();
    this.isPromoCodeSet = this.basketService.getIsPromoCodeSet();
    this.promotion = this.basketService.getPromotion();

    if (typeof this.totalWithTax === "undefined" ){
      this.router.navigate(['/cart']);
    }

   // get user
    this.clientService.loadUser().subscribe((res:any) => {
        this.connectedUser = res;
        if (this.connectedUser.address != null && this.connectedUser.address.length > 0){
          this.isShippingAdresseSet = true;
        }
        else{
          this.isShippingAdresseSet = false;
        }
    },
    (error: HttpErrorResponse) => {
      if (error.status === 401) {
       // load userProfil
      if (localStorage.getItem("userProfile") != null  && this.authService.userProfile == null){
        this.up = localStorage.getItem("userProfile");
        this.authService.userProfile = JSON.parse(this.up); 
        // load userData
        if (this.authService.userData == null){
          this.clientService.loadUser().subscribe((res:any)=>{
            this.authService.userData = res;
              this.connectedUser = res;
              if (this.connectedUser.address != null && this.connectedUser.address.length > 0){
                this.isShippingAdresseSet = true;
              }
              else{
                this.isShippingAdresseSet = false;
              }
          });
        }
      }else{
        this.connectedUser = null;
        this.isShippingAdresseSet = false;
      }
     }
    });
  }

  isDefaultAdressCheckedFunction() {
    if (this.isDefaultAdressChecked)
      this.isDefaultAdressChecked = false;
    else
      this.isDefaultAdressChecked = true;

      if (this.isDefaultAdressChecked) {
        const formControls: { [key: string]: any } = {};
        this.checkoutFieldsData.forEach((field: any) => {
          if (field.shown) {
            if (field.name == "Créer un compte") {
              this.createAccount = true;
            } else if (field.name == "Nom et prenom") {
              formControls[field.name] = [this.connectedUser.firstName + ' ' + this.connectedUser.lastName || '', field.required ? Validators.required : ''];
            } else if (field.name == "Email") {
              formControls[field.name] = [this.connectedUser.email || '', field.required ? Validators.required : ''];
            } else if (field.name == "Adresse") {
              formControls[field.name] = [this.connectedUser.address || '', field.required ? Validators.required : ''];
            } else if (field.name == "Ville") {
              formControls[field.name] = [this.connectedUser.city || '', field.required ? Validators.required : ''];
            } else if (field.name == "Code postal") {
              formControls[field.name] = [this.connectedUser.zipCode || '', field.required ? Validators.required : ''];
            } else if (field.name == "Téléphone") {
              formControls[field.name] = [this.connectedUser.phone || '', field.required ? Validators.required : ''];
            } else if (field.name == "Téléphone supplémentaire") {
              formControls[field.name] = [this.connectedUser.phone2 || '', field.required ? Validators.required : ''];
            } else {
              formControls[field.name] = [this.connectedUser[field.name] || '', field.required ? Validators.required : ''];
            }
          }
        });
        this.checkoutForm = this.fb.group(formControls);
      } else {
        this.initCheckoutForm();
      }
      
}

  initCheckoutForm(): void {
    const formControls: { [key: string]: any } = {};
    this.checkoutFieldsData.forEach((field:any) => {
      if (field.shown) {
        if (field.name == "Créer un compte"){
          this.createAccount = true;
        }
        formControls[field.name] = field.required ? ['', Validators.required] : '';
      }
    });
    this.checkoutForm = this.fb.group(formControls);
  }

  submitCheckoutForm(): void {
    if (this.checkoutForm.valid) {
      console.log('Form submitted successfully!');
      const formData = this.checkoutForm.value;

      //
      this.checkoutHome = false;
      this.loadingPage = true;
      //

      // now check if data sent by user or guest
      const userProfileString = localStorage.getItem("userProfile");

      let userType="";
      if (userProfileString !== null) {
        userType="CLIENT";
        this.clientService.addClientOrder(formData,this.totalPrices,this.totalWithTax,this.shippingFees,this.promotion,userType,this.paymentType).subscribe((res:any) => {
          // out of stock
          if (res.message.includes("out of stock.")){
             //
            this.checkoutHome = true;
            this.loadingPage = false;
            //
            this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
          }
          else if (res.message.includes("Order added successfully.")){
            let dotIndex = res.message.indexOf(".");
            let orderID = res.message.slice(dotIndex+1,res.message.length);
            // navigate to confirmation page
            this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
          }
          else{
            alert("Order error.");
          }
        });
      } else {
        userType="GUEST";
        this.authService.addOrder(formData,this.totalPrices,this.totalWithTax,this.shippingFees,this.promotion,userType,this.paymentType).subscribe((res:any) => {
         // out of stock
         if (res.message.includes("out of stock.")){
            //
            this.checkoutHome = true;
            this.loadingPage = false;
            //
            this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
         }
         else if (res.message.includes("Order added successfully.")){
            let dotIndex = res.message.indexOf(".");
            let orderID = res.message.slice(dotIndex+1,res.message.length);
            // navigate to confirmation page
            this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
          }
          else{
            alert("Order error.");
          }
        });
      }
     
    } else {
      console.log('Form validation failed!');
    }
  }
  

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
      this.paymentType = this.storeData.paymentByDefault;
    });
  }

  loadCheckoutFieldsData(){
    this.authService.getCheckoutFieldsData().subscribe((res:any) => {
      this.checkoutFieldsData = res;
      this.initCheckoutForm();
    });
  }
  
  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
  }

  getProductImagePhotoUrl(productImageID: string): string {
    return `${this.authService.host}/public/productImage/${productImageID}`;
  }

  getVariantImage(variantId: string): string {
    return `${this.authService.host}/public/variant/${variantId}`;
  }

}
