import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../services/admin.service';

export interface DialogData {
  checkpass: any;
}

@Component({
  selector: 'app-dialog-confirm-pass-admin',
  templateUrl: './dialog-confirm-pass-admin.component.html',
  styleUrls: ['./dialog-confirm-pass-admin.component.css']
})
export class DialogConfirmPassAdminComponent implements OnInit {
  checkPassError:any;
  isPasswordCorrect = false;


  constructor( private adminService: AdminService,
     public dialogRef: MatDialogRef<DialogConfirmPassAdminComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }


  checkPassword(){
    this.adminService.checkPassword(this.data.checkpass).subscribe((res:any) =>{
      if (res.message == "Mot de passe correct."){
       this.checkPassError = "";
       this.isPasswordCorrect = true;
       this.dialogRef.close();
      }
      else{
        this.checkPassError = "Votre mot de passe est incorrect.";
        this.isPasswordCorrect = false;
      }
    },
      (error) => {
        console.error(error);
        this.checkPassError = error.error.message;
        this.isPasswordCorrect = false;
      });

  }

}
