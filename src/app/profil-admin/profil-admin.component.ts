import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { countries } from 'countries-list';
import { AdminService } from '../services/admin.service';
import { User } from '../model/User';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmPassAdminComponent } from '../dialog-confirm-pass-admin/dialog-confirm-pass-admin.component';

@Component({
  selector: 'app-profil-admin',
  templateUrl: './profil-admin.component.html',
  styleUrls: ['./profil-admin.component.css']
})
export class ProfilAdminComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  admUSER:any;
  admin:any;
  countries: string[];
  photoFile!: File;
  selectPhoto:any;
  isRealImage:any;
  imagePreview: any;
  user: any;
  isEmailUpdated:any = false;
  isBioUpdated:any = false;
  errorPreviewImage:any = "";

  checkpass:any;
  checkPassError:any;
  isPhotoUpdated:any;

  //dob verification
  maxDate!: string;

  //update pass
  currentPass!:string;
  newPass!:string;
  confirmPass!:string;




  constructor(public authService: AuthService, private adminService: AdminService,private toastr: ToastrService,public dialog: MatDialog) { 
    this.countries = this.getCountries();
  }

  
    // Confirm Pass Dialog Priv Data
    openConfirmPassDialog(): void {
      const dialogRef = this.dialog.open(DialogConfirmPassAdminComponent, {
        width: '300px',
        data: {checkpass: this.checkpass}
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.isPasswordCorrect){
          console.log("code correct");
          this.savePrivData();
        }
        else {
          console.log("code incorrect");

        }
     });
    }
    // END Confirm Pass Dialog

    // Confirm Pass Dialog Second Data
    openConfirmPassDialogSecondData(): void {
      const dialogRef = this.dialog.open(DialogConfirmPassAdminComponent, {
        width: '300px',
        data: {checkpass: this.checkpass}
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.isPasswordCorrect){
          console.log("code correct");
          this.saveSecondsData();
        }
        else {
          console.log("code incorrect");

        }
     });
    }
    // END Confirm Pass Dialog


  ngOnInit(): void {
    this.user = new User();
    this.selectPhoto = 0; // init selectPhoto 0
    this.isRealImage = false;
    this.isPhotoUpdated = false;
    // init admin
 

      // get user and save it in localStorage
      this.adminService.loadUser().subscribe((res:any) => {
        this.authService.userData = res;
        this.admin = this.authService.userData;
      });
    
    // end init

    // Calculate the minimum allowed date (18 years ago from today)
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0];
    console.log(this.maxDate);
  }

  updatePassword(){
    this.adminService.checkPassword(this.currentPass).subscribe((res:any) =>{
      if (res.message == "Mot de passe correct."){
        // check new pass
       if (this.newPass == this.confirmPass){
          this.adminService.updatePassword(this.newPass).subscribe((res:any) => {
            if (res.message == "Votre mot de passe à été changé avec succès."){
              this.toastr.success(res.message, 'Success', {timeOut: 2000 });
            }
            else{
              this.toastr.error(res.message, 'Error', {timeOut: 2000 });
            }
          });
       }
       else {
        this.toastr.error('Vérifiez votre nouveau mot de passe.', 'Error', {timeOut: 2000 });
       }
      }
      else{
        this.toastr.error('Votre actuel mot de passe est incorrect.', 'Error', {timeOut: 2000 });

      }
    },
      (error) => {
        console.error(error);
        this.toastr.success(error.error.message, 'Error', {timeOut: 2000 });
      });

  }

  

  getCountries(): string[] {
    const countryCodes = Object.keys(countries);
    const countryNames = countryCodes.map((code) => countries[code as keyof typeof countries].name);
    return countryNames;
  }

  onSelectCountry(event: any) {
    const selectedCountry = event.target.value;
    this.admin.country = selectedCountry;
    console.log('Selected Country:', selectedCountry);
  }

  onUpload() {
    this.adminService.uploadPhotoProfile(this.photoFile).subscribe((res:any) => {
      if (res.message == "Photo updated successfully"){
        this.isPhotoUpdated = true;
        this.toastr.success('Votre photo de profile a été mise à jour avec succès', 'Success', {timeOut: 2000 });
      }
      
    },
    (error) => {
      this.toastr.error(error.error.message, 'Error', {timeOut: 2000 });
    });
  }

  selectFile(evt: any) {
    if(evt.target.files.length>0){
      this.photoFile=evt.target.files[0];
      console.log(this.photoFile);
      this.adminService.checkRealImage(this.photoFile).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImage = true;
          this.selectPhoto = 1;
          this.errorPreviewImage = res.message;
          if (this.photoFile && this.selectPhoto == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(this.photoFile);
          }
        }
      },
      (error) => {
        console.error(error);
        this.isRealImage = false;
        this.selectPhoto = 0;
        this.errorPreviewImage = error.error.message;
      });
      
    }
  }

  isEmailValid(email:any) {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  }
  // save Private info ( email + bio + uploaded image)
  savePrivData(){
    this.user = this.admUSER;
    if (this.selectPhoto == 1 && this.isRealImage == true ){
      // uplaod image
      this.onUpload();
    }
        this.adminService.savePrivData(this.admin.bio,this.admin.email).subscribe((res:any) => {
            if (res.message == "Data Updated Successfully"){
            // get user and save it in localStorage
            this.adminService.loadUser().subscribe((res:any) => {
              this.authService.userData = res;
              this.admin = this.authService.userData;
            });
              this.toastr.success('Vos informations ont été mises à jour avec succès', 'Success', {timeOut: 2000 });
            }
        },
        (error) => {
          this.toastr.error(error.error.message, 'Error', {timeOut: 2000 });
        }); 
        
    
    }

    onSelected(value:string): void {
      this.admin.gender = value;
      console.log("new gender = "+this.admin.gender);
    }

    saveSecondsData(){
      this.adminService.saveSecondsData(this.admin.gender, this.admin.firstName, this.admin.lastName, this.admin.address, this.admin.phone, this.admin.dob, this.admin.country, this.admin.city,this.admin.state,this.admin.zipCode).subscribe((res:any) => {

       if (res.message == "Data Updated Successfully"){
            // get user and save it in localStorage
            this.adminService.loadUser().subscribe((res:any) => {
              this.admUSER = this.authService.userData;
              this.admin = this.authService.userData;
            });
              this.toastr.success('Vos informations ont été mises à jour avec succès', 'Success', {timeOut: 2000 });
            }
        },
        (error) => {
          this.toastr.error(error.error.message, 'Error', {timeOut: 2000 });
        }); 
    }
  


}
