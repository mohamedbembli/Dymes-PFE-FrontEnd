import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-add-claim-dialog',
  templateUrl: './client-add-claim-dialog.component.html',
  styleUrls: ['./client-add-claim-dialog.component.css']
})
export class ClientAddClaimDialogComponent implements OnInit {

  claimSent:any=false;

  subject:any = null;
  comment:any = null;
  orderID:any = null;

  errorMSG: string | null = null;

  constructor(public dialogRef: MatDialogRef<ClientAddClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private clientService: ClientService) { 
      this.orderID = data.orderID;
    }

  ngOnInit(): void {

  }

  cancel(){
    this.dialogRef.close();
  }

  checkData(){
    if ((this.subject != null && this.subject.length > 0) && (this.comment != null && this.comment.length > 0)){
      this.clientService.addClaim(this.subject,this.comment,this.orderID).subscribe((res:any) => {
        if (res.message == "Claim added success."){
          this.claimSent = true;
          this.cancel();
        }
        else{
          this.claimSent = false;
        }
      });
    }
    else{
      this.showErrorMessage("Veuillez compléter le formulaire et réessayer, s'il vous plaît !");
    }

  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 3000);
  }

  closeError() {
    this.errorMSG = null;
  }

}
