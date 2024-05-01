import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ModulesService } from '../services/modules.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})

export class AdminLoginComponent implements OnInit {

  loginFormGroup! : FormGroup;
  idToken : any;
  errorMessage :any;
  up:any;
  profilPhoto:any;

  suspendedUser:any = false;

  modules: any[] = [];

 constructor(private fb : FormBuilder, private moduleService: ModulesService, private authservice : AuthService, private adminService: AdminService,  private router : Router) {

  }

 ngOnInit() {

     // load userProfil
    if (localStorage.getItem("userProfile") != null  && this.authservice.userProfile == null){
      this.up = localStorage.getItem("userProfile");
      this.authservice.userProfile = JSON.parse(this.up); 
    }
    // check if user are aready Authenticated
    if (this.authservice.isAuthenticated() && (this.authservice.hasRole("ADMIN") ||this.authservice.hasRole("EMPLOYEE")) ){
      this.router.navigateByUrl("/admin");
    }

    this.loginFormGroup=this.fb.group({
      email : this.fb.control(""),
      password : this.fb.control("")
    });
 }

 handleLogin() {
 
  this.errorMessage=undefined;
  let email=this.loginFormGroup.value.email;
  let password=this.loginFormGroup.value.password;
  this.authservice.login(email,password).subscribe({ 
    next: async response => {
      this.idToken = response;
      this.authservice.authenticateUser(this.idToken);
      if ( this.authservice.hasRole("ADMIN") || this.authservice.hasRole("EMPLOYEE")) {
          // get user and save it in localStorage
          this.adminService.getUserById(this.authservice.userProfile?.userId).subscribe(async (res:any) => {
          if (res.suspension){
            this.suspendedUser = true;
            this.errorMessage = "Votre compte a été suspendu, contactez votre administrateur!";
          }
          else{
            this.authservice.userData = res;
            console.log("from admin login userData="+this.authservice.userData);
            await delay(200);
            this.router.navigateByUrl("/admin");
            // synchronise modules with backend
            if (this.authservice.hasRole("ADMIN")){
                // load modules
                this.moduleService.getModules().subscribe((data: any) => {
                this.modules = data;
                const processedData = this.moduleService.processModulesData(this.modules);
                this.moduleService.loadModules(processedData).subscribe();
              });
            }
            else {
              this.errorMessage = "Vous n'êtes pas autorisé à accéder";
            }
          }
        });
      }
      else{
        this.errorMessage = "Vous n'êtes pas autorisé à vous connecter avec cette URL.";
      }
    },
    error :err => {
      console.log(err);
      this.errorMessage = err.error.errorMessage;
      if (this.errorMessage == "Bad credentials"){
        this.errorMessage = "ERREUR : Le nom d'utilisateur ou le mot de passe que vous avez saisi est incorrect.";
      }
    }
  })

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}




}
