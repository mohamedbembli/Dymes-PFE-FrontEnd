import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogAddPromotionComponent } from '../dialog-add-promotion/dialog-add-promotion.component';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-dialog-shipping-fees',
  templateUrl: './dialog-shipping-fees.component.html',
  styleUrls: ['./dialog-shipping-fees.component.css']
})
export class DialogShippingFeesComponent implements OnInit {

  shippingFees:any=null;
  shippingFeesUpdated:any=false;
  totalCMD:any=null;

  constructor(public dialogRef: MatDialogRef<DialogAddPromotionComponent>, private storeService:StoreService,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.getFeesData();
    }

    getFeesData(){
      this.storeService.getStoreData().subscribe((res:any) => {
        this.shippingFees = res.shippingFees;
        this.totalCMD = res.globalDiscountShipping;
      });
    }

  checkData(){
    this.storeService.updateShippingFees(this.shippingFees,this.totalCMD).subscribe((res:any) => {
       if (res.message == "Shipping Fees Data updated success."){
        this.shippingFeesUpdated = true;
        this.toastr.success("Le frais de livraison a été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
        this.dialogRef.close();
       }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
