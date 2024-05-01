import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ModulesService } from '../services/modules.service';
import { PersonalService } from '../services/personal.service';

export interface DialogData {
  gender:any;
  firstName:any;
  lastName:any;
  email: any;
  pass:any;
  phone:any;
  bio:any;
}


@Component({
  selector: 'app-dialog-add-employee',
  templateUrl: './dialog-add-employee.component.html',
  styleUrls: ['./dialog-add-employee.component.css']
})
export class DialogAddEmployeeComponent implements OnInit {

  //add
  isDataCorrect:any = false;
  employeeAdded:any = false;
  modules: any[] = [];
  datatableItems: any[] = [];
  selectedModule: any = null; 
  selectedSubmodule: any;
  selectedModuleHasSubmodules = false;

  //update
  employeeData:any;
  isEditMode:any;
  userModuleAuthorizations: any;
  

  constructor(public dialogRef: MatDialogRef<DialogAddEmployeeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private moduleService: ModulesService,private toastr: ToastrService,
      private personalService: PersonalService) {
          if (data.isEditMode){
            this.employeeData = data.employeeData;
            this.isEditMode = data.isEditMode;
            // set Data to form
            this.data.gender = this.employeeData.gender;
            this.data.firstName = this.employeeData.firstName;
            this.data.lastName = this.employeeData.lastName;
            this.data.email = this.employeeData.email;
            this.data.phone = this.employeeData.phone;
            this.data.bio = this.employeeData.bio;
            this.userModuleAuthorizations = this.employeeData.authorizations;
            this.addModulesFromAuthorizations();
          }
      }

      addModulesFromAuthorizations() {
        if (this.userModuleAuthorizations) {
          // Loop through userModuleAuthorizations and add them to datatableItems
          for (const authorization of this.userModuleAuthorizations) {
            if (authorization.type === 'module' && !this.isItemExists(authorization.name, 'module', null)) {
              // Add module to datatableItems
              this.datatableItems.push({ type: 'module', name: authorization.name, parent: null });
            } else if (authorization.type === 'sous-module' && !this.isItemExists(authorization.name, 'sous-module', authorization.moduleParent)) {
              // Add submodule to datatableItems
              this.datatableItems.push({ type: 'sous-module', name: authorization.name, parent: authorization.moduleParent });
            }
          }
        }
      }

  ngOnInit(): void {
    this.moduleService.getModules().subscribe((data: any) => {
      this.modules = data;
      console.log(this.modules);
    });
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }


  checkData(){
    if ( (this.data.gender != null) && (this.data.firstName != null) && (this.data.lastName != null) && (this.isValidEmail(this.data.email))
        && (this.data.pass != null) && (this.data.pass.length > 3) && (this.data.phone != null) && (this.data.phone.length > 7) && (this.data.bio != null) && (this.data.bio.length > 2)
        && (this.datatableItems != null) && (this.datatableItems.length > 0) ){
          this.isDataCorrect = true;
          this.toastr.warning("Verification en cours!", 'Patientez SVP', {timeOut: 3000 });

          const dataToSend = {
            gender: this.data.gender,
            firstName: this.data.firstName,
            lastName: this.data.lastName,
            email: this.data.email,
            password: this.data.pass,
            phoneNumber: this.data.phone,
            BIO: this.data.bio,
            modules: this.datatableItems.map(item => {
              return {
                name: item.name,
                type: item.type,
                parent: item.parent
              };
            })
          };
          if (this.isEditMode){
            this.personalService.updatePersonal(dataToSend).subscribe((res:any) =>{
              if (res.message == "Employee updated success."){
                this.dialogRef.close();
                this.employeeAdded = true;
                this.toastr.success("Votre profil personnel a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
              }
              else if (res.message == "Employee not found."){
                this.employeeAdded = false;
                this.toastr.error("L'employé n'est pas trouvé!", 'Erreur', {timeOut: 3000 });
              }
              else{
                this.employeeAdded = false;
                this.toastr.error("Réssayer SVP!", 'Erreur', {timeOut: 3000 });
              }
          });
          }
          else{
            this.personalService.addPersonal(dataToSend).subscribe((res:any) =>{
              if (res.message == "Employee added success."){
                this.dialogRef.close();
                this.employeeAdded = true;
                this.toastr.success("Votre personnel a été ajouté avec succès!", 'Opération réussie', {timeOut: 3000 });
              }
              else if (res.message == "Employee already exist"){
                this.employeeAdded = false;
                this.toastr.error("L'employé existe déjà!", 'Erreur', {timeOut: 3000 });
              }
          });
          }
        }
        else{
          this.isDataCorrect = false;
          this.toastr.error("Vérifiez vos informations!", 'Ajouter Personnel', {timeOut: 3000 });
        }
   
  }

   isValidEmail(email:any) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  onSelected(value:string): void {
    this.data.gender = value;
    console.log("new gender = "+ this.data.gender);
  }

  onModuleChange() {
    console.log(this.selectedModule); 
    if (this.selectedModule && this.selectedModule.submodules) {
      this.selectedModuleHasSubmodules = this.selectedModule.submodules.length > 0;
    } else {
      this.selectedModuleHasSubmodules = false;
    }
    this.selectedSubmodule = undefined;
  }

  addSubmodule() {
    if (this.selectedSubmodule) {
      const submoduleNamesToAdd = this.getGlobalModulesForSubmodule(this.selectedSubmodule);
      const moduleName = this.selectedModule.name;
      console.log("SUBMODULE added = " + this.selectedSubmodule);
  
      // Check if the global module is already in the datatable
      const isGlobalModuleInDatatable = this.datatableItems.some(item => item.type === 'module' && item.name === moduleName);
  
      if (isGlobalModuleInDatatable) {
        console.log("Global module is already in the datatable, cannot add submodule.");
        return; // Exit the function without adding the submodule
      }
  
      // Add the submodule
      if (!this.isItemExists(this.selectedSubmodule, 'sous-module',moduleName)) {
        this.datatableItems.push({ type: 'sous-module', name: this.selectedSubmodule, parent: moduleName });
      }
    }
    this.selectedSubmodule = null;
  }

  getGlobalModulesForSubmodule(submoduleName: string): string[] {
    const globalModules: string[] = [];
  
    // Loop through your modules to find the global modules associated with the submoduleName
    for (const module of this.modules) {
      if (module.submodules && module.submodules.some((submodule: { name: string }) => submodule.name === submoduleName)) {
        globalModules.push(module.name);
      }
    }
  
    return globalModules;
  }
  
  
  
  addModule() {
    if (this.selectedModule) {
      const moduleName = this.selectedModule.name;
      console.log("MODULE added = " + moduleName);
  
      // Fetch submodules for the selected module
      const submoduleNamesToRemove = this.getSubmoduleNamesForModule(moduleName);
  
      // Remove submodules with the same name from datatableItems
      this.datatableItems = this.datatableItems.filter(item => {
        if (submoduleNamesToRemove.includes(item.name)) {
          return false;
        }
        return true;
      });
  
      // Add the module
      if (!this.isItemExists(moduleName, 'module',null)) {
        this.datatableItems.push({ type: 'module', name: moduleName, parent: null });
      }
    }
    this.selectedModule = null;
  }
  
  
  
  getSubmoduleNamesForModule(moduleName: string): string[] {
    const moduleData = this.modules.find(module => module.name === moduleName);
    if (moduleData && moduleData.submodules) {
      return moduleData.submodules.map((submodule: { name: string }) => submodule.name);
    }
    return [];
  }
  
  isItemExists(name: string, type: string, parent: any): boolean {
    return this.datatableItems.some(item => item.name === name && item.type === type && item.parent === parent);
  }
  
  

  removeItem(index: number) {
    this.datatableItems.splice(index, 1);
  }

  getModuleAndSubmoduleNames(): { type: string, name: string, parent: string }[] {
    const namesWithType = this.datatableItems.map(item => ({ type: item.type, name: item.name, parent: item.parent }));
    return namesWithType;
  }
  

}
