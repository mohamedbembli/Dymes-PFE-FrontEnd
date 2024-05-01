import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogShippingFeesComponent } from '../dialog-shipping-fees/dialog-shipping-fees.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Input() homePage:any=true;
  @Input() checkoutConfigPage:any=false;
  @Input() OLCpage:any=false;
  @Input() storePage:any=false;



  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("inside ngOnInit settings func");
      this.homePage = true;
      this.storePage = false;
      this.OLCpage = false;
      this.checkoutConfigPage = false;
    
  }

  changeTemplate(name: string) {
    this.homePage = false;
    this.checkoutConfigPage = false;
    this.OLCpage = false;
    this.storePage = false;

    
    if (name === 'home') {
      this.homePage = true;
      this.storePage = false;
      this.OLCpage = false;
      this.checkoutConfigPage = false;
    } else if (name === 'store') {
      this.homePage = false;
      this.storePage = true;
      this.OLCpage = false;
      this.checkoutConfigPage = false;
    } else if (name === 'OLC') {
      this.OLCpage = true;
      this.homePage = false;
      this.storePage = false;
      this.checkoutConfigPage = false;
    } else if (name === 'checkout') {
      this.checkoutConfigPage = true;
      this.OLCpage = false;
      this.homePage = false;
      this.storePage = false;
    }
  }

  // Add ShippingFees Dialog
  openAddShippingFeesDialog(): void {
    const dialogRef = this.dialog.open(DialogShippingFeesComponent, {
      width: '500px',
      height:'300px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.shippingFeesUpdated){
        console.log("data correct");
      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END add ShippingFees Dialog


}
