import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientAddClaimDialogComponent } from '../client-add-claim-dialog/client-add-claim-dialog.component';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';
import { UserAddressDialogComponent } from '../user-address-dialog/user-address-dialog.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;

  basketProducts: any[] = [];

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  orderHistoryDashboard:any=true;
  addressDashboard:any=false;

  userData:any=null;

  errorMSG: string | null = null;
  successMSG: string | null = null;

  isAddressAlreadyExist:any=false;

  ordersList:any=null;



  constructor(private authService:AuthService, private clientService: ClientService, public dialog: MatDialog) { }

    // Add UserAddress Dialog
    openAddUserAddressDialog(): void {
      const dialogRef = this.dialog.open(UserAddressDialogComponent, {
        width: '500px',
        height:'650px',
        data: {
          isEditMode: false
        }
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.addressUpdated){
          this.ngOnInit();
          this.showSuccessMessage("Votre adresse a été mise à jour avec succès.");
          
        }
        else{
          this.showErrorMessage("Erreur! Réessayer svp!")
        }
     });
    }
    // END add UserAddress Dialog

     // Update UserAddress Dialog
     openUpdateUserAddressDialog(): void {
      const dialogRef = this.dialog.open(UserAddressDialogComponent, {
        width: '500px',
        height:'650px',
        data: {
          isEditMode: true,
          user: this.userData, 
        },
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.addressUpdated){
          this.showSuccessMessage("Votre adresse a été mise à jour avec succès.");
          this.ngOnInit();
          this.isAddressAlreadyExist = true;
        }
     });
    }
    // END update UserAddress Dialog

    // Add Claim Dialog
    openAddClaimDialog(orderID:any): void {
      const dialogRef = this.dialog.open(ClientAddClaimDialogComponent, {
        data: {
          orderID: orderID
        }
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.claimSent){
          this.ngOnInit();
          this.showSuccessMessage("Votre réclamation a été envoyée avec succès.");
          
        }
     });
    }
    // END add Claim Dialog

  ngOnInit(): void {
    this.clientService.loadUser().subscribe((res:any)=>{
      this.userData = res;
      this.getOrdersList();
      if (this.userData.address != null){
        this.isAddressAlreadyExist = true;
      }
      else{
        this.isAddressAlreadyExist = false;
      }
    });
  }

  cancelOrder(orderID:any){
    this.clientService.cancelOrder(orderID).subscribe((res:any) => {
      if (res.message == "Order cancelled successfully."){
        this.showSuccessMessage("Votre commande a été annulée avec succès.")
        this.getOrdersList();
      }
      else{
        this.showErrorMessage("Erreur ! Veuillez réessayer s'il vous plaît !")
      }
    });
  }

  getOrdersList(){
    this.clientService.getOrders().subscribe((res:any) => {
      this.ordersList = res;
    }
    ,(error: HttpErrorResponse) => {
      if (error.status === 500) {
        this.ordersList = null;
      }
    });
  }

  ngAfterViewInit(): void {
    this.clientService.loadUser().subscribe((res:any)=>{
      this.userData = res;
    });
  }

  removeAddress(){
    this.clientService.deleteAddress().subscribe((res:any) => {
      if (res.message == "Address deleted success."){
        this.showSuccessMessage("Votre adresse a été supprimée avec succès.");
        this.ngOnInit();
        this.isAddressAlreadyExist = false;
      }
      else{
        this.showErrorMessage("Erreur! Réessayer svp");
      }
    });
  }

  addAddress(){
    if (this.userData.address != null){
      this.showErrorMessage("Vous pouvez ajouter une seule adresse. Une adresse est déjà associée à votre compte. Si vous souhaitez la modifier, veuillez mettre à jour la dernière.");
    }
    else{
      this.openAddUserAddressDialog();
    }
  }

  enableAddress(){
    this.addressDashboard = true;
    this.orderHistoryDashboard = false;
  }

  enableDashboard(){
    this.addressDashboard = false;
    this.orderHistoryDashboard = true;
  }

  logout(){
    this.authService.logout();
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 4000);
  }

  closeError() {
    this.errorMSG = null;
  }

  showSuccessMessage(message: string) {
    this.successMSG = message;
    setTimeout(() => (this.successMSG = null), 3000);
  }

  closeSuccess() {
      this.successMSG = null;
  }

}
