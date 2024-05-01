import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  currentYear:any;
  storeData:any;
  logoPreview:any=null;
  order:any;

  oneOrder:any=false;
  twoOrders:any=false;
  orderID1:any="";
  orderID2:any="";

  confirmationMsg:any="";

  constructor(private authService: AuthService,private router: Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loadCheckoutFieldsData();
    const currentUrl = window.location.href;
    if (currentUrl.includes("OfferOrderConfirmation")){
      this.twoOrders = true;
      this.oneOrder = false;
      this.route.params.subscribe(params => {
        this.orderID1 = atob(params['idPreviousOrder']);
        this.orderID2 = atob(params['idUpsellOrder']);
        this.authService.getOrder(this.orderID2).subscribe((res:any) => {
          console.log("res = "+res);
          if (res == null){
            this.router.navigate(['/']);
          }
          if (res.status == "En attente"){
            this.order = res;
          }
        });
      });
    }
    else{
      this.twoOrders = false;
      this.oneOrder = true;
      this.route.params.subscribe(params => {
        this.orderID1 = atob(params['id']);
        this.orderID2 = "";
        this.authService.getOrder(this.orderID1).subscribe((res:any) => {
          console.log("res = "+res);
          if (res == null){
            this.router.navigate(['/']);
          }
          if (res.status == "En attente"){
            this.order = res;
            localStorage.removeItem("basketProducts");
            localStorage.removeItem("basketItemCount");
          }
        });
      });
    }

    this.logoPreview = this.authService.host+"/public/store/logo";    
    this.loadStoreData();
    this.currentYear = this.getCurrentYear();
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
    });
  }

  loadCheckoutFieldsData(){
    this.authService.getCheckoutFieldsData().subscribe((res:any) => {
      this.confirmationMsg = res[0].orderConfirmationMsg;
    });
  }

  getCurrentYear(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return currentYear;
  }

}
