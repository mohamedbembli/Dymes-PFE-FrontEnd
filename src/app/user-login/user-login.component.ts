import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;

  basketProducts: any[] = [];

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  hidenRegister:any=true;
  hidenLogin:any=false;

  emailLogin:any=null;
  passLogin:any=null;

  emailRegister:any=null;
  passRegister:any=null;
  confirmPassRegister:any=null;

  errorMSG: string | null = null;
  successMSG: string | null = null;

  idToken : any;
  suspendedUser:any=false;
  up:any;

  constructor(private authService: AuthService, private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    // load userProfil
    if (localStorage.getItem("userProfile") != null  && this.authService.userProfile == null){
      this.up = localStorage.getItem("userProfile");
      this.authService.userProfile = JSON.parse(this.up); 
    }
    // check if user are aready Authenticated
    if (this.authService.isAuthenticated() && (this.authService.hasRole("USER")) ){
      this.router.navigateByUrl("/myaccount");
    }

  }

  handleLogin(){
    let allOkey=true;
    if (this.isValidEmail(this.emailLogin)){

    }
    else{
      this.showErrorMessage("Veuillez vérifier le format de votre adresse e-mail.");
    }
    this.errorMSG = null;
    this.authService.login(this.emailLogin,this.passLogin).subscribe({ 
      next: async response => {
        this.idToken = response;
        this.authService.authenticateUserClient(this.idToken,"USER");
        if (this.authService.hasRole("USER")) {
            // get user and save it in localStorage
            this.clientService.loadUser().subscribe(async (res:any) => {
            if (res.suspension){
              console.log("res.suspension = "+res.suspension);
              this.suspendedUser = true;
              this.errorMSG = "Votre compte a été suspendu, contactez notre support!";
            }
            else{
              this.authService.userData = res;
              localStorage.setItem('userProfile',JSON.stringify(this.authService.userProfile));
              console.log("from user login userData="+this.authService.userData);
              await delay(200);
              this.router.navigateByUrl("/myaccount");
            }
          });
        }
        else{
          this.showErrorMessage("Vous n'êtes pas autorisé à vous connecter avec cette URL.");
        }
      },
      error :err => {
        console.log(err);
        if (err.error.errorMessage == "Bad credentials"){
          this.errorMSG = "ERREUR : Le nom d'utilisateur ou le mot de passe que vous avez saisi est incorrect.";
        }else{
          this.errorMSG = err.error.errorMessage;
        }
      }
    });
  
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
  }

  registerNow(){
    let allOkey = true;
    if ((this.passRegister != null && this.confirmPassRegister != null) && (this.passRegister.length > 3 && this.confirmPassRegister.length > 3)){
      if (this.passRegister != this.confirmPassRegister){
        this.showErrorMessage("Veuillez vérifier vos mots de passe. Ils ne sont pas identiques !");
        allOkey = false;
      }
    }
    else{
      this.showErrorMessage("Entrez un mot de passe forts!");
      allOkey = false;
    }
    if (!this.isValidEmail(this.emailRegister)){
      console.log("this.emailRegister = "+this.emailRegister);
      this.showErrorMessage("Veuillez vérifier le format de votre adresse e-mail.");
      allOkey = false;
    }
    if (allOkey){
      this.authService.addClient(this.emailRegister,this.passRegister,this.confirmPassRegister).subscribe((res:any) => {
        if (res.message == "User added success."){
          this.showSuccessMessage("Merci pour votre inscription! Profitez bien de nos offres.");
          this.hidenRegister = true;
          this.hidenLogin = false;

          this.emailRegister = null;
          this.passRegister = null;
          this.confirmPassRegister = null;
        }
        if (res.message == "User already exist"){
          this.showErrorMessage("Erreur : Un compte est déjà enregistré avec votre adresse e-mail.");
        }
        if (res.message != "User added success." && res.message != "User already exist"){
          this.showErrorMessage("Vérifiez vos informations.");
        }
      });
    }
  }

   isValidEmail(email:string) {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  switchSL(){
    if (this.hidenLogin){
      this.hidenLogin = false;
      this.hidenRegister = true;
    }
    else{
      this.hidenLogin = true;
      this.hidenRegister = false;
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
