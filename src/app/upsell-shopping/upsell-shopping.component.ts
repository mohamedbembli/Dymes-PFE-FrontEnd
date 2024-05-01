import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-upsell-shopping',
  templateUrl: './upsell-shopping.component.html',
  styleUrls: ['./upsell-shopping.component.css']
})
export class UpsellShoppingComponent implements OnInit {

  upsellObj:any;
  embeddedUrlHeader!: SafeResourceUrl;
  embeddedUrlBody!: SafeResourceUrl;
  embeddedUrlFooter!: SafeResourceUrl;

  previousOrderID:any=null;
  nextOrderID:any=null;

  previousOrder:any=null;
  nextOrder:any=null;

  totalWithTax:any=0;
  total:any;

  nextProduct:any=null;
  errorMSG: string | null = null;

  upsellID:any=null;

  constructor(private sanitizer: DomSanitizer, public authService: AuthService, private router: Router,
     private route: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.upsellID = atob(params['id']);
      this.previousOrderID = atob(params['orderid']);
      this.authService.getUpsellOffer(this.upsellID).subscribe((res:any) => {
        if (res == null){
          this.router.navigate(['/']);
        }
        else{
          this.upsellObj = res;
          // sanitize the embedded video URL
          if (this.upsellObj.headerType == 'video'){
            const embedUrlHeader = 'https://www.youtube.com/embed/' + this.getVideoId(this.upsellObj.header);
            this.embeddedUrlHeader = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrlHeader);
          }
          if (this.upsellObj.bodyType == 'video'){
            const embedUrlBody = 'https://www.youtube.com/embed/' + this.getVideoId(this.upsellObj.body);
            this.embeddedUrlBody = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrlBody);
          }
          if (this.upsellObj.footerType == 'video'){
            const embedUrlFooter = 'https://www.youtube.com/embed/' + this.getVideoId(this.upsellObj.footer);
            this.embeddedUrlFooter = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrlFooter);
          }
        }
        // get previous order data
        this.authService.getOrder(this.previousOrderID).subscribe((res1:any) => {
          this.previousOrder = res1;
        });
        // get product for upsell item
        this.authService.getProduct(this.upsellObj.nextProductID).subscribe((res2:any) => {
          this.nextProduct = res2;
        });
      });
    });
  }

  // function to extract video ID from YouTube URL
  getVideoId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  }

  calculateTotal(){
    // CASE 1
    if (this.nextProduct.simpleDiscountValue == null){
      this.total =  this.nextProduct.sellPrice;
    }
    // CASE 2
    if (this.nextProduct.simpleDiscountValue > 0 ){
      if (this.nextProduct.simpleDiscountType == 'fixed'){
        this.total = this.nextProduct.sellPrice - this.nextProduct.simpleDiscountValue;
      }
      if (this.nextProduct.simpleDiscountType == 'percent'){
        this.total = this.nextProduct.sellPrice - ((this.nextProduct.sellPrice * this.nextProduct.simpleDiscountValue) / 100);
      }
    }
    this.totalWithTax += this.total + ((this.total * this.nextProduct.tva) / 100);
  }

  cofirmNewOrder(){
    this.calculateTotal();

    // now check if data sent by user or guest
    const userProfileString = localStorage.getItem("userProfile");

    let userType="";
    if (userProfileString !== null) {
     userType="CLIENT";
     this.clientService.fastCheckoutClient(this.previousOrder.fullName,this.previousOrder.principalPhone,this.previousOrder.address,this.upsellObj.nextProductID,1,0,
      this.totalWithTax,"",this.total,"product",this.nextProduct.name).subscribe((res:any)=>{
        if (res.message.includes("Order added successfully.")){
          let dotIndex = res.message.indexOf(".");
          let orderID = res.message.slice(dotIndex+1,res.message.length);
          // upsell
          this.authService.approveUpsell(this.upsellID).subscribe((res:any) => {
            if (res.message == "Upsell approved successfully."){
              this.router.navigate(['/OfferOrderConfirmation/'+btoa(this.previousOrderID)+'/'+btoa(orderID)]);
            }
            else{
              this.showErrorMessage("Erreur! Veuillez réessayer, s'il vous plaît.")
            }
          // check if upSell exist before navigate to confirmation page
            });
          }
        else{
          this.showErrorMessage("La commande n'a pas été effectuée ! Veuillez réessayer, s'il vous plaît.");
        }
      });
    }
    else{
     userType="GUEST";
     this.authService.fastCheckoutGuest(this.previousOrder.fullName,this.previousOrder.principalPhone,this.previousOrder.address,this.upsellObj.nextProductID,1,0,
      this.totalWithTax,"",this.total,"product",this.nextProduct.name).subscribe((res:any)=>{
        if (res.message.includes("Order added successfully.")){
          let dotIndex = res.message.indexOf(".");
          let orderID = res.message.slice(dotIndex+1,res.message.length);
          // upsell
          this.authService.approveUpsell(this.upsellID).subscribe((res:any) => {
            if (res.message == "Upsell approved successfully."){
              this.router.navigate(['/OfferOrderConfirmation/'+btoa(this.previousOrderID)+'/'+btoa(orderID)]);
            }
            else{
              this.showErrorMessage("Erreur! Veuillez réessayer, s'il vous plaît.")
            }
          // check if upSell exist before navigate to confirmation page
            });
          }
        else{
          this.showErrorMessage("La commande n'a pas été effectuée ! Veuillez réessayer, s'il vous plaît.");
        }
      });
    }

  }

  cancelNewOrder(){
    this.authService.cancelUpsell(this.upsellID).subscribe((res:any) => {
      if (res.message == "Upsell cancelled successfully."){
        this.router.navigate(['/orderConfirmation/'+btoa(this.previousOrderID)]);
      }
      else{
        this.showErrorMessage("Erreur! Veuillez réessayer, s'il vous plaît.")
      }
    });
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

}
