import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements  OnInit, AfterViewInit, OnDestroy {

  dataTable:any;

  cGender:any;
  cFirstName:any;
  cLastName:any;
  cEmail:any;
  cPhone:any;
  cPhone2:any;

  clientsList:any = [];
  selectedUser:any =null;

  constructor(public authService: AuthService, private adminService: AdminService, private toastr: ToastrService) { }

  

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(){
    this.adminService.loadClients().subscribe((res:any) => {
      if (res != null){
        this.clientsList = res;
      }
      else{
        this.clientsList = [];
      }
      console.log(res);
      // Initialize DataTables after data is loaded
      this.ngAfterViewInit();

    });
  }

  ngAfterViewInit(): void {
    $('#clientsTable').DataTable().destroy();
    
    const dataTable = $('#clientsTable').DataTable({
      data: this.clientsList,
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
        { data: 'phone' },
        { data: 'phone2' },
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
        }
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
      const firstRow = $('#clientsTable tbody tr:first');
      if (firstRow.length > 0) {
        firstRow.trigger('click');
         this.selectedUser = this.clientsList.find((user:any) => user.id === firstRow.data('id'));        
        
      }

      // Event delegation to handle the click event for clickable icons
      $('#clientsTable tbody').on('click', '.clickable-icon', (event: Event) => {
        event.stopPropagation();
        const clickedRow = dataTable.row($(event.target).closest('tr'));
        const client = clickedRow.data();

        if (client && client.suspension !== undefined) {
          // Access the 'suspension' property from the 'client' object
          const suspensionValue = !client.suspension; // change suspension value to update it directly in backend
          console.log('New Suspension Value:', suspensionValue);
          // update suspesion value with backend
          this.adminService.changeClientStatus(client.id,suspensionValue).subscribe((res:any) => {
            if (res.message == "Client status updated successfully"){
              this.loadClients();
              this.toastr.success("Client status a été mise à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            }
          });
        }
      });

      const searchInput = $('#searchInput');

    // Add an event listener for the search input using an arrow function
    searchInput.on('keyup', () => {
      dataTable.search(searchInput.val()).draw();
    });

    $('#clientsTable tbody').on('click', 'tr', (event: Event) => {
      event.stopPropagation();
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const id = $(clickedRow).data('id');
      console.log(id);
      this.selectedUser = this.clientsList.find((user:any) => user.id === id);        


    });

  }

  ngOnDestroy(): void {
    $('#clientsTable').DataTable().destroy();
  }



}
