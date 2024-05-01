import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { OrderLifeCycleService } from '../services/order-life-cycle.service';


@Component({
  selector: 'app-dialog-order-life-cycle-step',
  templateUrl: './dialog-order-life-cycle-step.component.html',
  styleUrls: ['./dialog-order-life-cycle-step.component.css']
})
export class DialogOrderLifeCycleStepComponent implements OnInit {

  stepAdded:any=false;
  isEditMode:any=false;
  stepName:any=null;
  action:any="0";
  photoFileLogo:any=null;
  isRealImageLogo:any=null;
  selectPhotoLogo:any=0;
  imagePreviewLogo:any=null;

  stepID:any;



  constructor(private authService: AuthService, private orderLifeCycleService: OrderLifeCycleService, public dialogRef: MatDialogRef<DialogOrderLifeCycleStepComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService, private adminService: AdminService) {
      this.isEditMode = data.isEditMode;
      if (data.isEditMode){
        this.isEditMode = true;
        this.stepID = data.step.id;
        this.stepName = data.step.stepName;
        if (data.step.logo != null){
          this.selectPhotoLogo = 1;
          this.imagePreviewLogo = this.authService.host+'/public/OLC/'+data.step.id;
        }
        this.action = data.step.action;
      }
  }

  ngOnInit(): void {
  }


  sendData(){
    let errGlob:any=false;
    if (this.stepName == null || this.stepName.length == 0 ){
      errGlob = true;
        this.toastr.error("Veuillez entrer un nom pour votre nouvelle étape !", 'Erreur', {timeOut: 3000 });
    }
    if (!errGlob){
      //add
      if (!this.isEditMode){
        this.orderLifeCycleService.addStep(this.stepName,this.photoFileLogo,this.action).subscribe((res:any) => {
          if (res.message == "Step added success."){
              this.toastr.success("Votre étape a été ajouté avec succès!", 'Opération réussie', {timeOut: 3000 });
              this.stepAdded = true;
              this.dialogRef.close();
          }
          if (res.message == "Step already exist."){
            this.toastr.error("Cette étape existe déja!", 'Erreur', {timeOut: 3000 });
          }
        });
      }
      //update
      else{
        this.orderLifeCycleService.updateStep(this.stepID,this.stepName,this.photoFileLogo,this.action).subscribe((res:any) => {
          if (res.message == "Step updated success."){
              this.toastr.success("Votre étape a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
              this.stepAdded = true;
              this.dialogRef.close();
          }
        });
      }
    }
  }

  selectFileLogo(evt: any) {
    if(evt.target.files.length>0){
      this.photoFileLogo=evt.target.files[0];
      console.log(this.photoFileLogo);
      this.adminService.checkRealImage(this.photoFileLogo).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageLogo = true;
          this.selectPhotoLogo = 1;
          if (this.photoFileLogo && this.selectPhotoLogo == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewLogo = e.target.result;
            };
            reader.readAsDataURL(this.photoFileLogo);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageLogo = false;
        this.selectPhotoLogo = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  cancel(){
    this.dialogRef.close();
  }

}
