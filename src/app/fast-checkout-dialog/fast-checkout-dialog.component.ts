import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-fast-checkout-dialog',
  templateUrl: './fast-checkout-dialog.component.html',
  styleUrls: ['./fast-checkout-dialog.component.css']
})
export class FastCheckoutDialogComponent implements OnInit {
  fullName:any = null;
  phone:any=null;
  address:any=null;

  paymentDone:any = false;
  productNewPrice:any=null;
  item:any=null;
  description:any="";
  total:any;
  shippingFees:any;
  totalWithTax:any=0;

  storeData:any;
  totalShippingFees:any=0;

  errorMSG: string | null = null;

  constructor(public dialogRef: MatDialogRef<FastCheckoutDialogComponent>, private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private router: Router) {
      this.item = data.itemFastCheckout[0][0];
      //console.log("this.item = "+JSON.stringify(this.item));
      setTimeout(() => {
        this.calculateProductNewPrice();
        this.calculateTotal();
      }, 0);

     }

  ngOnInit(): void {
  }

  checkData(){
    if ( (this.fullName != null && this.fullName.length > 0) && (this.phone != null && this.phone.length > 0) &&(this.address != null && this.address.length > 0)){
      let ObjName:any;
      if (this.item.type == "product"){
        ObjName = this.item.obj.name;
      }
      if (this.item.type == "variant"){
        ObjName = this.item.product.name;
      }

       // now check if data sent by user or guest
       const userProfileString = localStorage.getItem("userProfile");

       let userType="";
       if (userProfileString !== null) {
        userType="CLIENT";
        this.clientService.fastCheckoutClient(this.fullName,this.phone,this.address,this.item.obj.id,this.item.qte,this.totalShippingFees,this.totalWithTax,
          this.description,this.total,this.item.type,ObjName).subscribe((res:any)=>{
            // out of stock
            if (res.message.includes("out of stock.")){
              this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
            }
            else if (res.message.includes("Order added successfully.")){
              let dotIndex = res.message.indexOf(".");
              let orderID = res.message.slice(dotIndex+1,res.message.length);
              // check if upSell exist before navigate to confirmation page
              if (this.item.type == "product"){
                if (this.item.obj.upsells.length > 0){
                  this.cancel();
                  this.router.navigate(['/specialOffer/'+btoa(this.item.obj.upsells[0].id)+'/'+btoa(orderID)]);
                }
                else{
                  this.cancel();
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
              }
              if (this.item.type == "variant"){
                if (this.item.product.upsells.length > 0){
                  alert("upsell exist");
                  // navigate to confirmation page
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
                else{
                  // navigate to confirmation page
                  this.cancel();
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
              }
            }
            else{
              alert("Order error.");
            }
          });
      
       }
       else {
        userType="GUEST";
        this.authService.fastCheckoutGuest(this.fullName,this.phone,this.address,this.item.obj.id,this.item.qte,this.totalShippingFees,this.totalWithTax,
          this.description,this.total,this.item.type,ObjName).subscribe((res:any)=>{
            // out of stock
            if (res.message.includes("out of stock.")){
              this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
            }
            else if (res.message.includes("Order added successfully.")){
              let dotIndex = res.message.indexOf(".");
              let orderID = res.message.slice(dotIndex+1,res.message.length);
              // check if upSell exist before navigate to confirmation page
              if (this.item.type == "product"){
                if (this.item.obj.upsells.length > 0){
                  this.cancel();
                  this.router.navigate(['/specialOffer/'+btoa(this.item.obj.upsells[0].id)+'/'+btoa(orderID)]);
                }
                else{
                  this.cancel();
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
              }
              if (this.item.type == "variant"){
                if (this.item.product.upsells.length > 0){
                  alert("upsell exist");
                  // navigate to confirmation page
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
                else{
                  // navigate to confirmation page
                  this.cancel();
                  this.router.navigate(['/orderConfirmation/'+btoa(orderID)]);
                }
              }
            }
            else{
              alert("Order error.");
            }
          });
      }
      
    }
    else{
      this.showErrorMessage("Vérifiez vos informations!");
    }
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

  getShippingFees(): any {
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
      if (this.storeData.globalDiscountShipping != null){
        if (this.totalWithTax - this.totalShippingFees >= this.storeData.globalDiscountShipping){
          this.totalShippingFees = 0;
          return this.totalShippingFees;
        }
      }
    
      const product = this.item;
      if (product.type === 'product') {
        if (product.obj.shippingPrice != null && product.obj.shippingPrice >= 0) {
          this.totalShippingFees = product.obj.shippingPrice;
          return this.totalShippingFees;
        } else {
          if (this.storeData.shippingFees != null){
            // If all shipping prices are null, return shippingFees
           this.totalShippingFees = this.storeData.shippingFees;
           return this.totalShippingFees;
          }
          else{
            this.totalShippingFees = 0;
            return this.totalShippingFees;
          }
        }
      } 
       if (product.type === 'variant') {
        if (product.product.shippingPrice != null && product.product.shippingPrice >= 0) {
          this.totalShippingFees = product.product.shippingPrice;
          return this.totalShippingFees;
        } else {
          if (this.storeData.shippingFees != null){
           this.totalShippingFees = this.storeData.shippingFees;
           return this.totalShippingFees;
          }
          else{
            this.totalShippingFees = 0;
            return this.totalShippingFees;
          }
        }
      }
    });
  
  }

  calculateProductNewPrice(){
     //variant new price
    if (this.item.type == "variant"){
      this.description = this.item.obj.elements.map((item: any) => item.name).join(', ');
      // CASE 1
      if (this.item.product.discounts.length == 0 && this.item.product.simpleDiscountValue == null){
        this.productNewPrice  = this.item.obj.price;
      }
      // CASE 2
      if ((this.item.product.discounts.length == 0) && (this.item.product.simpleDiscountValue > 0  && this.item.qte >= 1)){
        if (this.item.product.simpleDiscountType == 'fixed'){
          this.productNewPrice = this.item.obj.price - this.item.product.simpleDiscountValue;
        }
        if (this.item.product.simpleDiscountType == 'percent'){
         this.productNewPrice = this.item.obj.price - ((this.item.obj.price * this.item.product.simpleDiscountValue) / 100);
        }
      }
      // CASE 3
      if ((this.item.product.discounts.length > 0) && (this.item.product.simpleDiscountValue > 0  && this.item.qte == 1)){
        if (this.item.product.simpleDiscountType == 'fixed'){
          this.productNewPrice = this.item.obj.price - this.item.product.simpleDiscountValue;
        }
        if (this.item.product.simpleDiscountType == 'percent'){
          this.productNewPrice = this.item.obj.price - ((this.item.obj.price * this.item.product.simpleDiscountValue) / 100);
        }
      }
      // CASE 4
      if ((this.item.product.discounts.length > 0) && (this.item.product.simpleDiscountValue >= 0  && this.item.qte > 1)){
        this.item.product.discounts.forEach((discount:any) => {
          if (this.item.qte == discount.quantity){
            if (discount.type ==  'fixed'){
              this.productNewPrice = this.item.obj.price - discount.value;
            }
            if (discount.type ==  'percent'){
              this.productNewPrice = this.item.obj.price - ((this.item.obj.price * discount.value ) / 100);
            }
          }
        });
      }
      // CASE 5
      if(this.item.qte > this.item.product.discounts[this.item.product.discounts.length - 1].quantity){
        if (this.item.product.discounts[this.item.product.discounts.length - 1].type ==  'fixed'){
          this.productNewPrice = this.item.obj.price - this.item.product.discounts[this.item.product.discounts.length - 1].value;
        } 
        if (this.item.product.discounts[this.item.product.discounts.length - 1].type == 'percent'){
          this.productNewPrice = this.item.obj.price - ((this.item.obj.price * this.item.product.discounts[this.item.product.discounts.length - 1].value ) / 100);
        }
      }
    }
    //product new price
    if (this.item.type == "product"){
       this.description = "";

       // CASE 1
       if (this.item.obj.discounts.length == 0 && this.item.obj.simpleDiscountValue == null){
         this.productNewPrice =  this.item.obj.sellPrice;
       }
       // CASE 2
       if ((this.item.obj.discounts.length == 0) && (this.item.obj.simpleDiscountValue > 0  && this.item.qte >= 1)){

         if (this.item.obj.simpleDiscountType == 'fixed'){
           this.productNewPrice = this.item.obj.sellPrice - this.item.obj.simpleDiscountValue;
         }
         if (this.item.obj.simpleDiscountType == 'percent'){
           this.productNewPrice = this.item.obj.sellPrice - ((this.item.obj.sellPrice * this.item.obj.simpleDiscountValue) / 100);
          }
       }
       // CASE 3
       if ((this.item.obj.discounts.length > 0) && (this.item.obj.simpleDiscountValue > 0  && this.item.qte == 1)){
         if (this.item.obj.simpleDiscountType == 'fixed'){
           this.productNewPrice = this.item.obj.sellPrice - this.item.obj.simpleDiscountValue;
         }
         if (this.item.obj.simpleDiscountType == 'percent'){
           this.productNewPrice = this.item.obj.sellPrice - ((this.item.obj.sellPrice * this.item.obj.simpleDiscountValue) / 100);
         }
       }
       // CASE 4
       if ((this.item.obj.discounts.length > 0) && (this.item.obj.simpleDiscountValue >= 0  && this.item.qte > 1)){
         this.item.obj.discounts.forEach((discount:any) => {
           if (this.item.qte == discount.quantity){
               this.productNewPrice = discount.finalPrice;
           }
         });
       }
       // CASE 5
       if (this.item.obj.discounts.length > 0){
        if (this.item.qte > this.item.obj.discounts[this.item.obj.discounts.length - 1].quantity){
          this.productNewPrice = this.item.obj.discounts[this.item.obj.discounts.length - 1].finalPrice;
        }
       }
    }

  }


  calculateTotal(){
    //TOTAL VARIANT
    if (this.item.type == "variant"){
      this.description = this.item.obj.elements.map((item: any) => item.name).join(', ');
      // CASE 1
      if (this.item.product.discounts.length == 0 && this.item.product.simpleDiscountValue == null){
        console.log("case 1 variant");
        this.total  = this.item.obj.price * this.item.qte;
      }
      // CASE 2
      if ((this.item.product.discounts.length == 0) && (this.item.product.simpleDiscountValue > 0  && this.item.qte >= 1)){
        console.log("case 2 variant");
        if (this.item.product.simpleDiscountType == 'fixed'){
          this.total = (this.item.obj.price - this.item.product.simpleDiscountValue) * this.item.qte;
        }
        if (this.item.product.simpleDiscountType == 'percent'){
         this.total = (this.item.obj.price - ((this.item.obj.price * this.item.product.simpleDiscountValue) / 100)) * this.item.qte;
        }
      }
      // CASE 3
      if ((this.item.product.discounts.length > 0) && (this.item.product.simpleDiscountValue > 0  && this.item.qte == 1)){
        console.log("case 3 variant");
        if (this.item.product.simpleDiscountType == 'fixed'){
          this.total = (this.item.obj.price - this.item.product.simpleDiscountValue) * this.item.qte;
        }
        if (this.item.product.simpleDiscountType == 'percent'){
          this.total = (this.item.obj.price - ((this.item.obj.price * this.item.product.simpleDiscountValue) / 100)) * this.item.qte;
        }
      }
      // CASE 4
      if ((this.item.product.discounts.length > 0) && (this.item.product.simpleDiscountValue >= 0  && this.item.qte > 1)){
        console.log("case 4 variant");
        this.item.product.discounts.forEach((discount:any) => {
          if (this.item.qte == discount.quantity){
            if (discount.type ==  'fixed'){
              this.total = (this.item.obj.price - discount.value) * this.item.qte;
            }
            if (discount.type ==  'percent'){
              this.total = (this.item.obj.price - ((this.item.obj.price * discount.value ) / 100)) * this.item.qte;
            }
          }
        });
      }
      // CASE 5
      if(this.item.qte > this.item.product.discounts[this.item.product.discounts.length - 1].quantity){
        console.log("case 5 variant");
        if (this.item.product.discounts[this.item.product.discounts.length - 1].type ==  'fixed'){
          this.total = (this.item.obj.price - this.item.product.discounts[this.item.product.discounts.length - 1].value) * this.item.qte;
        } 
        if (this.item.product.discounts[this.item.product.discounts.length - 1].type == 'percent'){
          this.total = (this.item.obj.price - ((this.item.obj.price * this.item.product.discounts[this.item.product.discounts.length - 1].value ) / 100)) * this.item.qte;
        }
      }
    }
    //TOTAL PRODUCT
    if (this.item.type == "product"){
      this.description = "";

      // CASE 1
      if (this.item.obj.discounts.length == 0 && this.item.obj.simpleDiscountValue == null){
        this.total =  this.item.obj.sellPrice * this.item.qte;
      }
      // CASE 2
      if ((this.item.obj.discounts.length == 0) && (this.item.obj.simpleDiscountValue > 0  && this.item.qte >= 1)){

        if (this.item.obj.simpleDiscountType == 'fixed'){
          this.total = (this.item.item.obj.sellPrice - this.item.item.obj.simpleDiscountValue) * this.item.qte;
        }
        if (this.item.obj.simpleDiscountType == 'percent'){
          this.total = (this.item.obj.sellPrice - ((this.item.obj.sellPrice * this.item.obj.simpleDiscountValue) / 100)) * this.item.qte;
          console.log("this.total = "+this.total);

        }
      }
      // CASE 3
      if ((this.item.obj.discounts.length > 0) && (this.item.obj.simpleDiscountValue > 0  && this.item.qte == 1)){
        if (this.item.obj.simpleDiscountType == 'fixed'){
          this.total = (this.item.obj.sellPrice - this.item.obj.simpleDiscountValue) * this.item.qte;
        }
        if (this.item.obj.simpleDiscountType == 'percent'){
          this.total = (this.item.obj.sellPrice - ((this.item.obj.sellPrice * this.item.obj.simpleDiscountValue) / 100)) * this.item.qte;
        }
      }
      // CASE 4
      if ((this.item.obj.discounts.length > 0) && (this.item.obj.simpleDiscountValue >= 0  && this.item.qte > 1)){
        this.item.obj.discounts.forEach((discount:any) => {
          if (this.item.qte == discount.quantity){
              this.total = discount.finalPrice * this.item.qte;
          }
        });
      }
      // CASE 5
      if (this.item.obj.discounts.length > 0){
        if (this.item.qte > this.item.obj.discounts[this.item.obj.discounts.length - 1].quantity){
          this.total = this.item.obj.discounts[this.item.obj.discounts.length - 1].finalPrice * this.item.qte;
        }
      }
    }
    // calculate totalWithTax
    if (this.item.type == 'product') {
      this.totalWithTax += this.total + ((this.total * this.item.obj.tva) / 100);
      this.getShippingFees();

    }

    if (this.item.type == 'variant') {
      this.totalWithTax += this.total + ((this.total * this.item.product.tva) / 100);
      this.getShippingFees();
    }
    console.log("total fastcheckout = "+this.total);
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  getProductPhotoUrl(productId: any): string {
    return `${this.authService.host}/public/product/${productId}`;
  }

  getVariantImage(variantId: string): string {
    return `${this.authService.host}/public/variant/${variantId}`;
  }


}
