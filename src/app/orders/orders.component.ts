import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChangeOrderStatusDialogComponent } from '../change-order-status-dialog/change-order-status-dialog.component';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  orderLifeCycleList:any=null;
  orderStatus:any=null;
  ordersList:any=null;

  isDialogOpen:any = false;
  selectedOrder:any =null;

  constructor(private adminService: AdminService,public authService: AuthService, private toastr: ToastrService, public dialog: MatDialog) { }

  // Add Personal Dialog
  openChangeOrderStatusDialog(): void {
    const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent, {
      width: '500px',
      data: this.selectedOrder
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.isDialogOpen = false;
      if (dialogRef.componentInstance.statusChanged){
        this.toastr.success("Le status de votre commande a été changée avec succès!", 'Opération réussie', {timeOut: 3000 });
        console.log("data correct");
        dialogRef.close();
        this.loadAllOrders();
      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Add Personal Dialog


  ngOnInit(): void {
    this.loadAllOrderLifeCycle();
    this.loadAllOrders();
  }

  ngOnDestroy(): void {
    $('#ordersTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#ordersTable').DataTable().destroy();
    const dataTable = $('#ordersTable').DataTable({
      data: this.ordersList,
      columns: [
        { data: 'id' },
        { data: 'date' },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
            let str="";
            row.myOrderProductsData.forEach((orderProductsData:any) => {
              if (orderProductsData.description.length == 0) {
                str += orderProductsData.quantity + " x " + orderProductsData.name + "<br>";
              } else {
                str += orderProductsData.quantity + " x " + orderProductsData.name + " (" + orderProductsData.description + ") " + "<br>";
              }
            });
              return str;
          },
        },
        { data: 'comment' },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
            if (row.promotion != null){
              if (row.promotion.discountType == "fixed_amount"){
                return "CODE: "+row.promotion.code+"<BR> VALEUR: "+row.promotion.discountValue+" DT";
              }
              else{
                return "CODE: "+row.promotion.code+"<BR> VALEUR: "+row.promotion.discountValue+" %";
              }
            }
            return "";
          },
        },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
            let str="";
            
            if (row.fullName != null) {
              str += row.fullName  + "<br>";                
            }
            if (row.address != null) {
              str += row.address  + "<br>";                
            }
            if (row.city != null) {
              str += row.city  + "<br>";                
            }
            if (row.state != null) {
              str += row.state  + "<br>";                
            }
            if (row.zipCode != null) {
              str += row.zipCode  + "<br>";                
            }
            if (row.pays != null) {
              str += row.pays  + "<br>";                
            }
            if (row.principalPhone != null) {
              str += row.principalPhone  + "<br>";                
            }
            if (row.secodaryPhone != null) {
              str += row.secodaryPhone  + "<br>";                
            }
            if (row.email != null) {
              str += row.email  + "<br>";                
            }
           
              return str;
          },
        },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
           
              if (row.paymentType == "COD") {
                 return "Paiement à la livraison";
              } 
              if (row.paymentType == "BANK") {
                return "Virement bancaire";
             }
             return "";
          },
        },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
            return row.totalWithTax+" DT";
          },
        },
        { data: 'status' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
            return `
              <button type="button" class="btn btn-primary change-status">Changer Status</button>
            `;
          },
        },
        
      ],
      rowCallback: (row:any, data:any) => {
        // Add data-id attribute to each row
        $(row).attr('data-id', data.id);
      },
      searching: true,
      paging: true,
  });

  $('#ordersTable tbody').on('click', '.change-status', (event: Event) => {
    event.stopPropagation(); // Stop event propagation to prevent multiple dialogs
        
    // Check if the dialog is already open
    if (this.isDialogOpen) {
      return;
    }

     // Get the closest <tr> element, which represents the clicked row
     const clickedRow = $(event.target).closest('tr');
     console.log("Clicked Row: ", clickedRow);
     const id = clickedRow.data('id');
     const rowData = this.ordersList.find((upsell: any) => upsell.id === id);
     // Check if rowData is not null or undefined
     if (rowData) {
       this.selectedOrder = rowData;
 
       // Set the flag to indicate that the dialog is open
       this.isDialogOpen = true;
       this.openChangeOrderStatusDialog();
     }
  
  });

  }

  loadAllOrderLifeCycle(){
    this.adminService.loadAllOrderLifeCycle().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.orderLifeCycleList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.orderLifeCycleList = null;
        }
        else {
          this.orderLifeCycleList = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.orderLifeCycleList = null;
      }
    });
  }

  onSelectedOrderStatus(orderS: any): void {
    this.orderStatus = orderS;
    console.log("orderStatus ="+this.orderStatus);
    this.loadAllOrders();
  }

  compareOrderStatus(order1: any, order2: any): boolean {
    return order1.stepName === order2.stepName && order1.id === order2.id;
  }

  loadAllOrders(){
    this.adminService.loadAllOrders().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.ordersList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.ordersList = null;
        }
        else {
          if (this.orderStatus == null){
            this.ordersList = res;
          }
          else{
            this.ordersList = res.filter((order: any) => order.status === this.orderStatus);
          }
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
        this.ordersList = null;
      }
    });
  }

}
