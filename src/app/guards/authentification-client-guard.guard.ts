import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationClientGuardGuard implements CanActivate {
  up:any;
  
  constructor(private authService: AuthService, private clientService: ClientService, private router: Router){
   
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // load userProfil
    if (localStorage.getItem("userProfile") != null  && this.authService.userProfile == null){
      this.up = localStorage.getItem("userProfile");
      this.authService.userProfile = JSON.parse(this.up); 
      // load userData
      if (this.authService.userData == null){
        this.clientService.loadUser().subscribe((res:any)=>{
            this.authService.userData = res;
            console.log("userData from client guard = "+this.authService.userData);
        });
      }
      
    }

     // Check if user is authenticated and has USER role
    const authenticated = this.authService.isAuthenticated();
    if (authenticated && this.authService.hasRole("USER")){
      return true;
    } else {
      this.router.navigateByUrl("/loginUsr");
      return false;
    }
  
  }
  
}
