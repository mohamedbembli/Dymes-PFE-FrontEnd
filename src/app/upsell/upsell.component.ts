import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAddUpsellComponent } from '../dialog-add-upsell/dialog-add-upsell.component';
import { UpsellService } from '../services/upsell.service';
declare var $: any;

@Component({
  selector: 'app-upsell',
  templateUrl: './upsell.component.html',
  styleUrls: ['./upsell.component.css']
})
export class UpsellComponent implements OnInit, AfterViewInit, OnDestroy  {

  upsellList:any;
  selectedUpsell:any;
  isDialogOpen:any=false;

  constructor(public upsellService: UpsellService, private route: ActivatedRoute, private router: Router,private toastr: ToastrService,public dialog: MatDialog) {}
  
  // Add upsell Dialog
  openAddUpsellDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUpsellComponent, {
      width: '600px',
      height:'600px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.isDialogOpen = false;
      if (dialogRef.componentInstance.upsellAdded){
        console.log("data correct");
        this.loadAllupSells();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Dialog

  // Add upsell Dialog
  openEditUpsellDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUpsellComponent, {
      width: '600px',
      height:'600px',
      data: {
        isEditMode: true, // Indicate that this is an edit operation
        upsell: this.selectedUpsell
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.isDialogOpen = false;
      if (dialogRef.componentInstance.upsellAdded){
        console.log("data correct");
        this.loadAllupSells();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Dialog

  ngOnInit(): void {
    this.loadAllupSells();

  }

  ngOnDestroy(): void {
    $('#upSellsTable').DataTable().destroy();

  }
  ngAfterViewInit(): void {
    $('#upSellsTable').DataTable().destroy();
    const dataTable = $('#upSellsTable').DataTable({
      data: this.upsellList,
      columns: [
        { data: 'id' },
        { data: 'name' },
        { data: 'countNo' },
        { data: 'countYes' },
        {
          // Custom column for status
          data: null,
          render: (data: any, type: any, row: any) => {
            if (row.countYes + row.countNo > 0 ) {
              return (row.countYes / (row.countYes + row.countNo)) * 100+" %";
            } else {
              return "0 %";
            }
          },
        }, 
        { data: 'creationDate' },
        {
          // Custom column for suspension status
          data: null,
          render: (data: any, type: any, row: any) => {
            if (!row.status) {
              return `
                <td>
                  <span class="badge bg-warning">Inactif</span>&nbsp;
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </td>
              `;
            } else {
              return `
                <td>
                  <span class="badge bg-success">Actif</span>&nbsp;
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
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

  // Event delegation to handle the click event for update buttons
  $('#upSellsTable tbody').on('click', '.update-button', (event: Event) => {
    event.stopPropagation(); 

    // Check if the dialog is already open
    if (this.isDialogOpen) {
      return;
    }

    // Get the closest <tr> element, which represents the clicked row
    const clickedRow = $(event.target).closest('tr');
    console.log("Clicked Row: ", clickedRow);
    const id = clickedRow.data('id');
    const rowData = this.upsellList.find((upsell: any) => upsell.id === id);
    // Check if rowData is not null or undefined
    if (rowData) {
      this.selectedUpsell = rowData;

      // Set the flag to indicate that the dialog is open
      this.isDialogOpen = true;
      this.openEditUpsellDialog();
    }
  });



   // Event delegation to handle the click event for "Supprimer" buttons
   $('#upSellsTable tbody').on('click', '.delete-button', (event: Event) => {
    event.stopPropagation();
    const clickedRow = dataTable.row($(event.target).closest('tr'));
    const upsell = clickedRow.data();
    this.deleteUpsell(upsell);
  });

   // Event delegation to handle the click event for clickable icons
   $('#upSellsTable tbody').on('click', '.clickable-icon', (event: Event) => {
    event.stopPropagation();
    const clickedRow = dataTable.row($(event.target).closest('tr'));
    const upsell = clickedRow.data();

    if (upsell && upsell.status !== undefined) {
      const statusValue = !upsell.status; // change status value
      // update status value with backend
      this.upsellService.changeUpsellStatus(upsell.id,statusValue).subscribe((res:any) => {
        if (res.message == "UpSell status updated successfully"){
          this.ngOnDestroy();
          this.loadAllupSells();
          this.toastr.success("Votre Upsell status a été mise à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
        }
        else{
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
      });
    }
  });

  $('#upSellsTable tbody').on('click', 'tr', (event: Event) => {
    event.stopPropagation();
    const clickedRow = event.currentTarget as HTMLTableRowElement;
    const id = $(clickedRow).data('id');
    console.log(id);
    this.selectedUpsell = this.upsellList.find((upsell:any) => upsell.id === id);        


  });

  }

  deleteUpsell(upsell: any): void {
    if (upsell && upsell.id) {
      this.upsellService.deleteUpsell(upsell.id).subscribe((res:any) =>{
          if (res.message == "UpSell deleted successfully"){
              this.loadAllupSells();
              this.ngAfterViewInit();
              this.toastr.success("Votre UpSell a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
               // Determine the index of the UpSell in the upsellList
              const index = this.upsellList.indexOf(upsell);
          
              // Check if the UpSell is found in the list
              if (index !== -1) {
                // Remove the UpSell from the upsellList
                this.upsellList.splice(index, 1);
          
                // Log the ID of the deleted UpSell
                console.log('Deleted Upsell ID:', upsell.id);
          
              }
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
      });
  
   
    }
  }

  loadAllupSells(){
    this.upsellService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.upsellList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.upsellList = res;
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
        this.upsellList = null;
      }
      
       
    });
  }

}
