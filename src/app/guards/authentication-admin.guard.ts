import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationAdminGuard implements CanActivate {
  up:any;

  constructor(private authService: AuthService, private adminService: AdminService, private router: Router){
   
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
        this.adminService.loadUser().subscribe((res:any)=>{
            this.authService.userData = res;
            console.log("userData from admin guard = "+this.authService.userData);
        });
      }
      
    }

      let authenticated = this.authService.isAuthenticated();
      
      if (authenticated && this.authService.hasRole("ADMIN") || authenticated && this.authService.hasRole("EMPLOYEE")){
        return true;
      } else {
        this.router.navigateByUrl("/loginAdm");
        return false;
      }
  }
  
}
