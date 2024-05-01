import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-user-address-dialog',
  templateUrl: './user-address-dialog.component.html',
  styleUrls: ['./user-address-dialog.component.css']
})
export class UserAddressDialogComponent implements OnInit {

  isEditMode:any;

  firstName:any="";
  lastName:any="";
  address:any="";
  phone:any="";
  phone2:any="";
  city:any="";
  zipCode:any="";
  gender:any="";

  addressUpdated:any=false;

  errorMSG: string | null = null;


  constructor(private clientService: ClientService, public dialogRef: MatDialogRef<UserAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.isEditMode){
        this.isEditMode = true;
        this.gender = data.user.gender;
        this.firstName = data.user.firstName;
        this.lastName = data.user.lastName;
        this.address = data.user.address;
        this.phone = data.user.phone;
        this.phone2 = data.user.phone2;
        this.city = data.user.city;
        this.zipCode = data.user.zipCode;
      }
      else{
        this.isEditMode = false;
      }
     }

  ngOnInit(): void {
  }

  checkData(){
    if ((this.firstName.length > 0 && this.lastName.length > 0 ) && (this.address.length > 0 && this.phone.length > 0 ) && (this.city.length > 0 && this.zipCode.length > 0 ) && this.gender.length > 0){
        this.clientService.updateAddress(this.gender,this.firstName,this.lastName,this.address,this.phone,this.phone2,this.city,this.zipCode).subscribe((res:any) => {
          if (res.message == "Address updated success."){
            this.addressUpdated = true;
            this.cancel();
          }
        });
    }  
    else{
      this.showErrorMessage("Vérifiez vos informations!");
    }
  }

  onSelected(value:string): void {
    this.gender = value;
    console.log("new gender = "+ this.gender);
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 4000);
  }

  closeError() {
    this.errorMSG = null;
  }


}
