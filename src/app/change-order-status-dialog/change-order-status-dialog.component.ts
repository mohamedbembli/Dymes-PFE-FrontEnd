import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-order-status-dialog',
  templateUrl: './change-order-status-dialog.component.html',
  styleUrls: ['./change-order-status-dialog.component.css']
})
export class ChangeOrderStatusDialogComponent implements OnInit {

  statusChanged:any=false;
  errorMSG: string | null = null;

  orderLifeCycleList:any=null;
  orderStatus:any=null;

  previousOLCStep:any=null;
  nextOLCStep:any=null;
  myOrder:any=null;

  constructor(public dialogRef: MatDialogRef<ChangeOrderStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminService, public authService:AuthService) {
      this.myOrder = data;
      this.orderStatus = data.status;
     }

  ngOnInit(): void {
    this.loadAllOrderLifeCycle();
  }

  cancel(){
    this.dialogRef.close();
  }

  checkData(){
    if (this.previousOLCStep != null && this.nextOLCStep !=null){
      this.adminService.changeOrderStatus(this.myOrder.id,this.previousOLCStep.id,this.nextOLCStep.id).subscribe((res:any) => {
        if (res.message == "Status changed successfully."){
          this.statusChanged = true;
          this.cancel();
        }
        else{
          this.statusChanged = false;
        }
      });
    }
    else{
      this.statusChanged = false;
      this.showErrorMessage("Erreur ! Veuillez réessayer plus tard s'il vous plaît !");
    }
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 3000);
  }

  closeError() {
    this.errorMSG = null;
  }

  loadAllOrderLifeCycle(){
    this.adminService.loadAllOrderLifeCycle().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.orderLifeCycleList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.orderLifeCycleList = null;
        }
        else {
          this.orderLifeCycleList = res;
          this.previousOLCStep = this.orderLifeCycleList.find((OLC: any) => OLC.stepName === this.orderStatus);
          console.log("previousOLCStep =" + JSON.stringify(this.previousOLCStep));
        }
      }
      else {
        console.log("Response is null or undefined");
        this.orderLifeCycleList = null;
      }
    });
  }

  onSelectedOrderStatus(orderS: any): void {
    this.orderStatus = orderS;
    this.nextOLCStep = this.orderLifeCycleList.find((OLC: any) => OLC.stepName === this.orderStatus);
    console.log("nextOLCStep = "+JSON.stringify(this.nextOLCStep));
  }

  compareOrderStatus(order1: any, order2: any): boolean {
    return order1 && order2 ? order1.stepName === order2.stepName : order1 === order2;
  }
  

}
