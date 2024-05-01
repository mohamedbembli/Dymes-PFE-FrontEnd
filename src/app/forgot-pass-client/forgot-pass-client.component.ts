import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-pass-client',
  templateUrl: './forgot-pass-client.component.html',
  styleUrls: ['./forgot-pass-client.component.css']
})
export class ForgotPassClientComponent implements OnInit {

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;

  basketProducts: any[] = [];

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  errorMSG: string | null = null;
  successMSG: string | null = null;

  state1:any = true;
  state2:any = false;
  state3:any = false;

  isButtonDisabled: boolean = false;


  email!:string;
  sCode!:string;
  newPass!:string;
  confirmPass!:string;

  constructor(public authService: AuthService, private router: Router) {

   }

  ngOnInit(): void {
  }

  forgetPass(){
    this.isButtonDisabled = true;
    this.authService.forgotPass(this.email).subscribe((res:any) => {
      if (res.message == "Le code d'activation a été envoyé à "+this.email){
        this.showSuccessMessage(res.message);
        this.state1 = false;
        this.state2 = true;
      }
      else{
        this.isButtonDisabled = false;
        this.showErrorMessage(res.message);
      }
    });
  }

  validateSecretCode(){
    this.authService.requestForPasswordInit(this.sCode,this.email).subscribe((res:any) => {
        if (res.message == "Votre code secret est valide"){
          this.showSuccessMessage(res.message);
          this.state2 = false;
          this.state3 = true;
        }
        else{
          this.showErrorMessage(res.message);
        }
    });
  }

 resetPass(){
  if (this.newPass == this.confirmPass){
    this.authService.updatePass(this.newPass,this.email).subscribe((res:any) => {
      if (res.message == "Votre mot de passe à été changé avec succès."){
        this.showSuccessMessage(res.message);
        this.router.navigateByUrl("/loginUsr");
      }
      else{
        this.showErrorMessage(res.message);
      }
    });
 }
 else {
  this.showErrorMessage('Vérifiez votre nouveau mot de passe.');
 }
 }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 3000);
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
