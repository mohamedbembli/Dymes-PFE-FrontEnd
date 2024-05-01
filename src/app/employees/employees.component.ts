import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAddEmployeeComponent } from '../dialog-add-employee/dialog-add-employee.component';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { PersonalService } from '../services/personal.service';
declare var $: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {
  dataTable:any;

  pGender:any;
  pFirstName:any;
  pLastName:any;
  pEmail:any;
  pPass:any;
  pPhone:any;
  pBIO:any;

  employeeList:any = [];
  selectedUser:any =null;
  isDialogOpen:any = false;

  constructor(public authService: AuthService, private personalService: PersonalService ,private toastr: ToastrService, public dialog: MatDialog) { }
  
  // Add Personal Dialog
    openAddPersonalDialog(): void {
      const dialogRef = this.dialog.open(DialogAddEmployeeComponent, {
        width: '500px',
        data: {gender: this.pGender, firstName: this.pFirstName, lastName: this.pLastName, email: this.pEmail, pass: this.pPass, phone: this.pPhone, bio: this.pBIO}
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.employeeAdded){
          console.log("data correct");
          dialogRef.close();
          this.loadEmployees();
        }
        else {
          console.log("data incorrect");

        }
     });
    }
    // END Add Personal Dialog

    // Edit Personal Dialog
    openEditEmployeeDialog(employee: any): void {
      const dialogRef = this.dialog.open(DialogAddEmployeeComponent, {
        width: '500px',
        data: {
          employeeData: this.selectedUser, // Pass the selected employee data to the dialog
          isEditMode: true, // Indicate that this is an edit operation
        },
      });
    
      dialogRef.afterClosed().subscribe(async () => {
        this.isDialogOpen = false;
        if (dialogRef.componentInstance.employeeAdded) {
          console.log('Employee data updated successfully');
          dialogRef.close();
          this.loadEmployees();
        } else {
          console.log('Employee data not updated');
        }
      });
    }
    // END Edit Personal Dialog

  ngOnInit(): void {
      this.loadEmployees();
  }


  loadEmployees(){
    this.personalService.loadPersonals().subscribe((res:any) => {
      if (res != null){
        this.employeeList = res;
      }
      else{
        this.employeeList = [];
      }
      console.log(res);
      // Initialize DataTables after data is loaded
      this.ngAfterViewInit();

    });
  }


  ngAfterViewInit(): void {
    $('#personnelTable').DataTable().destroy();
    
    const dataTable = $('#personnelTable').DataTable({
      data: this.employeeList,
      columns: [
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
            if (row.profilePhoto == null) {
              return '<img src="/assets/img/logoUserEmpty.png" width="32" height="32" class="rounded-circle my-n1" alt="Avatar">';
            } else {
              return '<img src="' + this.authService.host + '/public/profilePhoto/' + row.id + '" width="32" height="32" class="rounded-circle my-n1" alt="Avatar">';
            }
          },
        },
        {
          // Custom column for full name
          data: null,
          render: (data:any, type:any, row:any) => {
            return row.firstName + ' ' + row.lastName;
          },
        },
        { data: 'bio' },
        { data: 'email' },
        {
          // Custom column for suspension status
          data: null,
          render: (data: any, type: any, row: any) => {
            if (row.suspension) {
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
      // Add any other DataTables configuration options as needed
      });

      // Trigger click event on the first row if available
      const firstRow = $('#personnelTable tbody tr:first');
      if (firstRow.length > 0) {
        firstRow.trigger('click');
         this.selectedUser = this.employeeList.find((user:any) => user.id === firstRow.data('id'));        
        
      }

      // Event delegation to handle the click event for "Supprimer" buttons
      $('#personnelTable tbody').on('click', '.delete-button', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const employee = clickedRow.data();

        // Call the deleteEmployee method to remove the employee
        this.deleteEmployee(employee);
      });

      // Event delegation to handle the click event for clickable icons
      $('#personnelTable tbody').on('click', '.clickable-icon', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const employee = clickedRow.data();

        if (employee && employee.suspension !== undefined) {
          // Access the 'suspension' property from the 'employee' object
          const suspensionValue = !employee.suspension; // change suspension value to update it directly in backend
          console.log('New Suspension Value:', suspensionValue);
          // update suspesion value with backend
          this.personalService.changePersonalStatus(employee.id,suspensionValue).subscribe((res:any) => {
            if (res.message == "Employee status updated successfully"){
              this.loadEmployees();
              this.toastr.success("Votre personnel status a été mise à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            }
          });
        }
      });


       // Event delegation to handle the click event for update buttons
       $('#personnelTable tbody').on('click', '.update-button', (event: Event) => {
          event.stopPropagation(); // Stop event propagation to prevent multiple dialogs
        
          // Check if the dialog is already open
          if (this.isDialogOpen) {
            return;
          }
        
          const clickedRow = dataTable.row($(event.target).closest('tr'));
          const employee = clickedRow.data();
        
          // Set the flag to indicate that the dialog is open
          this.isDialogOpen = true;
          this.openEditEmployeeDialog(employee);
        });


      const searchInput = $('#searchInput');

    // Add an event listener for the search input using an arrow function
    searchInput.on('keyup', () => {
      dataTable.search(searchInput.val()).draw();
    });

    $('#personnelTable tbody').on('click', 'tr', (event: Event) => {
      event.stopPropagation();
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const id = $(clickedRow).data('id');
      console.log(id);
      this.selectedUser = this.employeeList.find((user:any) => user.id === id);        


    });

  }

  ngOnDestroy(): void {
    $('#personnelTable').DataTable().destroy();
  }

  deleteEmployee(employee: any): void {
    if (employee && employee.id) {
      // Get the ID of the employee before removing it
      const deletedEmployeeId = employee.id;
      this.personalService.deletePersonal(deletedEmployeeId).subscribe((res:any) =>{
          if (res.message == "Employee deleted successfully"){
              this.toastr.success("Votre personnel a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
               // Determine the index of the employee in the employeeList
              const index = this.employeeList.indexOf(employee);
          
              // Check if the employee is found in the list
              if (index !== -1) {
                // Remove the employee from the employeeList
                this.employeeList.splice(index, 1);
          
                // Log the ID of the deleted employee
                console.log('Deleted Employee ID:', deletedEmployeeId);
          
              }
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
      });
  
   
    }
  }
  




}
