import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CheckoutConfigurationService } from '../services/checkout-configuration.service';

@Component({
  selector: 'app-checkout-configuration',
  templateUrl: './checkout-configuration.component.html',
  styleUrls: ['./checkout-configuration.component.scss']
})
export class CheckoutConfigurationComponent implements OnInit, AfterViewInit {

  homePage:any=true;
  settingsPage:any=false;

  @ViewChild('table', { static: true }) table!: MatTable<any>;

  listFields:any= [];
  displayedColumns: string[] = [
    'name',
    'shown',
    'required'
  ];
  dataSource = this.listFields;
  orderConfirmationMsg:any=null;
  
  constructor(private checkoutConfigurationService: CheckoutConfigurationService ,private toastr: ToastrService) {

   }
  ngAfterViewInit(): void {
    this.loadAllFields();
  }

  ngOnInit(): void {
  }

  setPrincipalSettings(){
    this.homePage = false;
    this.settingsPage = true;
  }

  loadAllFields(){
    this.checkoutConfigurationService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.listFields = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.listFields = res;
          this.dataSource = this.listFields;
          this.orderConfirmationMsg = this.listFields[0].orderConfirmationMsg;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.listFields = null;
      }
      
       
    });
  }

  saveOrderConfirmationMsg(){
    this.checkoutConfigurationService.UpdateOrderConfirmationMSG(this.orderConfirmationMsg).subscribe((res:any) => {
      if (res.message == "Confirm MSG updated success."){
        this.toastr.success("Le message de a été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
      }
    });
  }

  toggleShow(id:any){
    this.checkoutConfigurationService.updateShown(id).subscribe((res:any) => {
      if (res.message == "Shown updated success."){
        this.toastr.success("Le champ a été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
      }
    });

  }

  toggleIsRequired(id:any){
    this.checkoutConfigurationService.updateIsRequired(id).subscribe((res:any) => {
      if (res.message == "isRequired updated success."){
        this.toastr.success("Le champ a été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
      }
    });
  }

}
