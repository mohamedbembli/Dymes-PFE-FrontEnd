import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAddPromotionComponent } from '../dialog-add-promotion/dialog-add-promotion.component';
import { AuthService } from '../services/auth.service';
import { PromotionService } from '../services/promotion.service';
declare var $: any;

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {

  promotionsList:any;
  currentDate!: Date;
  selectedPromo:any;
  isDialogOpen:any=false;

  

  constructor(public authService: AuthService, private promotionService: PromotionService, private route: ActivatedRoute, private router: Router,private toastr: ToastrService,public dialog: MatDialog) {

    this.currentDate = new Date();

   }

   // Add promotion Dialog
   openAddPromotionDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPromotionComponent, {
      width: '550px',
      height:'600px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.promotionAdded){
        console.log("data correct");
        this.loadAllPromotions();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Dialog

  // Add promotion Dialog
  openEditPromotionDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPromotionComponent, {
      width: '550px',
      height:'600px',
      data: {
        isEditMode: true, // Indicate that this is an edit operation
        promotion: this.selectedPromo
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.isDialogOpen = false;
      if (dialogRef.componentInstance.promotionAdded){
        console.log("data correct");
        this.loadAllPromotions();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Dialog

  ngOnInit(): void {
    this.loadAllPromotions();

  }

  ngOnDestroy(): void {
    $('#promotionsTable').DataTable().destroy();
  }

  ngAfterViewInit(): void {
    $('#promotionsTable').DataTable().destroy();
    
  const dataTable = $('#promotionsTable').DataTable({
    data: this.promotionsList,
    columns: [
      { data: 'id' },
      { data: 'code' },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.promoType == "allDays") {
            return "Toujours actif";
          } else {
            return "Active sur une période précise";
          }
        },
      },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.discountType == "fixed_amount") {
            return "Montant fixe";
          } else if (row.discountType == "percent"){
            return "Poucentage";
          }
          else {
            return "Livraison gratuite";
          }
        },
      },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.discountType == "fixed_amount") {
            return row.discountValue+" DT";
          } else if (row.discountType == "percent"){
            return row.discountValue+" %";
          }
          else {
            return "";
          }
        },
      },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.startDate != 'null' && row.expiryDate != 'null') {
            // check dates if expired
            const [day, month, year] = row.expiryDate.split('/');
            const givenDate = new Date(`${year}-${month}-${day}`);
            if (this.currentDate > givenDate && row.status != 'expired') {
              row.status = "expired";
              this.promotionService.updateStatus(row.id,"expired").subscribe();
            }
            else if (this.currentDate < givenDate && row.status == 'expired') {
              row.status = "actif";
              this.promotionService.updateStatus(row.id,"actif").subscribe();
            }
            //
            return row.startDate+" - "+row.expiryDate;
          } else {
            return "";
          }
        },
      },
      {
        // Custom column for suspension status
        data: null,
        render: (data: any, type: any, row: any) => {
          if (row.status == "inactif") {
            return `
              <td>
                <span class="badge bg-warning">Inactif</span>&nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </td>
            `;
          } else if (row.status == "actif") {
            return `
              <td>
                <span class="badge bg-success">Actif</span>&nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </td>
            `;
          }
          else{
            return `
              <td>
                <span class="badge bg-secondary">Expiré</span>&nbsp;
              </td>
            `;
          }
        },
      },
      {
        // Custom column for action buttons
        data: null,
        render: (data:any, type:any, row:any) => {
          return `
            <button type="button" class="btn btn-primary update-button">Modifier</button>
            <button type="button" class="btn btn-danger delete-button">Supprimer</button>
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

    // Trigger click event on the first row if available
    const firstRow = $('#promotionsTable tbody tr:first');
    if (firstRow.length > 0) {
      firstRow.trigger('click');
       this.selectedPromo = this.promotionsList.find((promo:any) => promo.id === firstRow.data('id'));        
    }

     // Event delegation to handle the click event for "Supprimer" buttons
     $('#promotionsTable tbody').on('click', '.delete-button', (event: Event) => {
      event.stopPropagation();
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const promo = clickedRow.data();

      this.deletePromo(promo);
    });

     // Event delegation to handle the click event for clickable icons
     $('#promotionsTable tbody').on('click', '.clickable-icon', (event: Event) => {
      event.stopPropagation();
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const promo = clickedRow.data();

      if (promo && promo.status !== undefined) {
        let status;
        if (promo.status == "actif")
            status = "inactif";
        else
          status = "actif";
        // update status
        this.promotionService.updateStatus(promo.id,status).subscribe((res:any) => {
          if (res.message == "Promotion status updated."){
            this.loadAllPromotions();
            this.toastr.success("Votre promotion status a été mise à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
            
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
        });
      }
    });

    // Event delegation to handle the click event for update buttons
    $('#promotionsTable tbody').on('click', '.update-button', (event: Event) => {
      event.stopPropagation(); // Stop event propagation to prevent multiple dialogs
    
      // Check if the dialog is already open
      if (this.isDialogOpen) {
        return;
      }
    
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const rowData = clickedRow.data();
      if (rowData){
        this.selectedPromo = rowData;
      }
    
      // Set the flag to indicate that the dialog is open
      this.isDialogOpen = true;
      this.openEditPromotionDialog();

      
    });

  }

  deletePromo(promo: any): void {
    if (promo && promo.id) {
      this.promotionService.deletePromo(promo.id).subscribe((res:any) =>{
          if (res.message == "Promo deleted successfully"){
              this.toastr.success("Votre promotion a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
               // Determine the index of the promo in the promotionsList
              const index = this.promotionsList.indexOf(promo);
          
              // Check if the promo is found in the list
              if (index !== -1) {
                // Remove the promo from the promotionsList
                this.promotionsList.splice(index, 1);
          
                // Log the ID of the deleted promo
                console.log('Deleted Promo ID:', promo.id);
                this.loadAllPromotions();
          
              }
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
      });   
    }
  }

  loadAllPromotions(){
    this.promotionService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.promotionsList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.promotionsList = res;
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
        this.promotionsList = null;
      }
      
       
    });
  }

}
