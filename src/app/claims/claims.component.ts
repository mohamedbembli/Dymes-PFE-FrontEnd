import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
declare var $: any;

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit, AfterViewInit, OnDestroy {

  claimsList:any = null;

  constructor(private adminService:AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllClaims();
  }

  ngOnDestroy(): void {
    $('#claimsTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#claimsTable').DataTable().destroy();
    const dataTable = $('#claimsTable').DataTable({
      data: this.claimsList,
      columns: [
        { data: 'id' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
              return row.myOrder.user.firstName+" "+row.myOrder.user.lastName;
          }
        },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
              return row.myOrder.user.phone;
          }
        },
        { data: 'subject' },
        { data: 'comment' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
              return row.myOrder.id;
          }
        },
        { data: 'status' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
            if (row.status == "Non traitée"){
              return `
              <button type="button" class="btn btn-success claimSolved-button" >Réclamation résolue</button>
            `;
            }
            else{
              return `
              <img src='/assets/img/success-order.png' height='35px' width='50px'>
            `;
            }
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

      $('#claimsTable tbody').on('click', '.claimSolved-button', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const rowData = clickedRow.data();
        if (rowData) {
          const id = rowData.id;
          this.adminService.changeClaimStatus(id).subscribe((res:any) => {
            if (res.message == "Claim Solved."){
              this.getAllClaims();
              this.toastr.success("Réclamation résolue avec succès.", 'Opération réussie', {timeOut: 3000 });
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            }
          });
        }
      });

  }

  getAllClaims(){
    this.adminService.loadClaims().subscribe((res:any) => {
     
      if (res != null){
        if (res.status === 204){
         this.claimsList = null;
          console.log("response is 204");
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.claimsList = null;
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.claimsList = res;
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
      }
      
       
    });
}

}
