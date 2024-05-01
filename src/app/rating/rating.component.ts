import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
declare var $: any;

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit, AfterViewInit, OnDestroy{
  ratingList:any=null;

  constructor(private adminService:AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllRating();
  }

  ngOnDestroy(): void {
    $('#ratingTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#ratingTable').DataTable().destroy();
    
    const dataTable = $('#ratingTable').DataTable({
      data: this.ratingList,
      columns: [
        { data: 'id' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
              return row.product.name;
            }
        },
        { data: 'fullname' },
        { data: 'mailOrPhone' },
        { data: 'comment' },
        { data: 'stars' },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
            if (row.status == "PENDING")
              return "EN ATTEND";
            else
              return "ACCEPTÉE";
            }
        },
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
            if (row.status == "PENDING"){
              return `
              <button type="button" class="btn btn-primary accept-button">Accepter</button>
              <button type="button" class="btn btn-danger delete-button">Supprimer</button>
            `;
            }
            else{
              return `
              <button type="button" class="btn btn-danger delete-button">Supprimer</button>
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

      // accept rating
      $('#ratingTable tbody').on('click', '.accept-button', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const rowData = clickedRow.data();
        if (rowData) {
          const id = rowData.id;
          this.adminService.acceptRating(id).subscribe((res:any) => {
            if (res.message == "Rating accepted successfully"){
              this.getAllRating();
              this.toastr.success("Vous avez accepté cet avis avec succès.", 'Opération réussie', {timeOut: 3000 });
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            }
          });
        }
      });
      // delete rating
      $('#ratingTable tbody').on('click', '.delete-button', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const rating = clickedRow.data();
              this.deleteRating(rating);
        });
  }

  deleteRating(rating: any): void {
    if (rating && rating.id) {
      const deletedRatingId = rating.id;
      this.adminService.deleteRating(deletedRatingId).subscribe((res:any) =>{
          if (res.message == "Rating deleted successfully"){
              this.toastr.success("Cet Avis a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
               // Determine the index of the rating in the ratingList
              const index = this.ratingList.indexOf(rating);
          
              // Check if the rating is found in the list
              if (index !== -1) {
                // Remove the rating from the ratingList
                this.ratingList.splice(index, 1);
          
                this.getAllRating();
              }
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
      });
  
   
    }
  }

  getAllRating(){
      this.adminService.loadRatings().subscribe((res:any) => {
       
        if (res != null){
          if (res.status === 204){
           this.ratingList = null;
            console.log("response is 204");
          }
          else if (res.status === 500){
            console.log("response is 500");
            this.ratingList = null;
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
          else {
            this.ratingList = res;
            this.ngAfterViewInit();
          }
        }
        else {
          console.log("Response is null or undefined");
        }
        
         
      });
  }

}
