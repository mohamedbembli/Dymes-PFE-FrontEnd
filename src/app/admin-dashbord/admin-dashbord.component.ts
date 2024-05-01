import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-admin-dashbord',
  templateUrl: './admin-dashbord.component.html',
  styleUrls: ['./admin-dashbord.component.css']
})
export class AdminDashbordComponent implements OnInit {
  adminDropDown:any=false;
  up:any;
  admUSER:any;
  admin:any;
  profilPhoto:any;

  isDashboard:any=true;
  isSettingAdmin:any=false;

  isAdmin:any=false;
  isEmployee:any=false;
  userAuthorizations:any;

  activeModule: string = ''; // Keep track of the active module

  //module
  statisticModule:any=true;
  profilSettings:any=false;
  ordersModule:any=false;
  catalogUEModule:any=false;
  siteWEBmodule:any=false;
  clientsModule:any=false;
  entrepriseModule:any=false;
  venteModule:any=false;
  storeSettingsModule:any=false
  
  homePageSettings:any=true;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // toggle function in dashboard component
    $("#togg").click(function() {
      $("#sidebar").toggleClass("toggled");
    });
    //end
    // init admin
    this.authService.loadUser().subscribe((res:any) => {
      this.authService.userData = res;
      this.admin = this.authService.userData;
      this.isAdmin = this.authService.hasRole("ADMIN");
      // admin role
      if (this.isAdmin){
        this.activeModule = 'Tableau de bord';
      }
      //end admin role
      this.isEmployee = this.authService.hasRole("EMPLOYEE");
      if (this.isEmployee && !this.isAdmin){
        this.userAuthorizations = this.authService.userData.authorizations;
        //console.log("Commandes auth = "+this.hasAuthorization("Commandes","sous-module",null));
        this.userAuthorizations.forEach((auth: any) => {
          if (auth.name === 'Tableau de bord' && auth.type === 'module') {
            this.activeModule = 'Tableau de bord';
            return; 
          }
          else if (auth.name === 'Commandes' && auth.type === 'module') {
            this.activeModule = 'Commandes';
            return; 
          }
        });
        
        // If 'Tableau de bord' is not authorized, set the first authorized module as active
        if (this.activeModule === '') {
          this.userAuthorizations.forEach((auth: any) => {
            if (this.activeModule === '' && auth.type === 'module') {
              this.activeModule = auth.name;
              return;
            }
            else if (this.activeModule === '' && auth.type === 'sous-module'){
              this.activeModule = auth.moduleParent;
              return;
            }
          });
        }
      }
    });
    
    // end init
      
  }

   changeActifModule(module:string){
    console.log("module = "+module);
    if (module == 'admin-profil'){
      this.adminDropDown = false;
    }
    
    this.activeModule = module;
  }


  // Function to check if the user has a specific authorization
  hasAuthorization(authorizationName: string, type:string, moduleParent:any): boolean {
    return this.userAuthorizations.some((auth: any) => auth.name === authorizationName && auth.type === type && auth.moduleParent === moduleParent);
  }

  changeDropDownAdmin(){
    if (this.adminDropDown)
    this.adminDropDown = false;
    else
    this.adminDropDown = true;
  }

  // logout
  logout(){
    this.authService.logout();
  }

}
