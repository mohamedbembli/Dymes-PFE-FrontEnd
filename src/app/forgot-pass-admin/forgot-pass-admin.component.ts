import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-pass-admin',
  templateUrl: './forgot-pass-admin.component.html',
  styleUrls: ['./forgot-pass-admin.component.css']
})
export class ForgotPassAdminComponent implements OnInit {

  state1:any = true;
  state2:any = false;
  state3:any = false;

  isButtonDisabled: boolean = false;


  email!:string;
  sCode!:string;
  newPass!:string;
  confirmPass!:string;

  constructor(public authService: AuthService, private route: ActivatedRoute, private router: Router,private toastr: ToastrService) {

   }

  ngOnInit(): void {
  }

  forgetPass(){
    this.isButtonDisabled = true;
    this.authService.forgotPass(this.email).subscribe((res:any) => {
      if (res.message == "Le code d'activation a été envoyé à "+this.email){
        this.toastr.success(res.message, 'Success', {timeOut: 4000 });
        this.state1 = false;
        this.state2 = true;
      }
      else{
        this.isButtonDisabled = false;
        this.toastr.error(res.message, 'Error', {timeOut: 4000 });
      }
    });
  }

  validateSecretCode(){
    this.authService.requestForPasswordInit(this.sCode,this.email).subscribe((res:any) => {
        if (res.message == "Votre code secret est valide"){
          this.toastr.success(res.message, 'Success', {timeOut: 4000 });
          this.state2 = false;
          this.state3 = true;
        }
        else{
          this.toastr.error(res.message, 'Error', {timeOut: 4000 });
        }
    });
  }

 resetPass(){
  if (this.newPass == this.confirmPass){
    this.authService.updatePass(this.newPass,this.email).subscribe((res:any) => {
      if (res.message == "Votre mot de passe à été changé avec succès."){
        this.toastr.success(res.message, 'Success', {timeOut: 3000 });
        this.router.navigateByUrl("/loginAdm");
      }
      else{
        this.toastr.error(res.message, 'Error', {timeOut: 3000 });
      }
    });
 }
 else {
  this.toastr.error('Vérifiez votre nouveau mot de passe.', 'Error', {timeOut: 3000 });
 }
 }


}
