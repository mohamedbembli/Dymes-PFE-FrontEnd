import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

interface Module {
  name: string;
  type?: string; 
  submodules?: Module[];
}

@Injectable({
  providedIn: 'root'
})

export class ModulesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public host : string = this.authService.host;

  getModules() {
    return this.http.get('assets/data/modules.json');
  }

  loadModules(modules: any) {
    return this.http.post<any>(this.host+'/employee/loadModules', modules);
  }

  //process the data and extract module names and types
  processModulesData(modules: any): { name: string; type: string, parent:any }[] {
  const result: { name: string; type: string, parent:any }[] = [];

  const processModule = (module: Module, moduleType: string, parent:any) => {
    result.push({ name: module.name, type: moduleType, parent:parent});

    if (module.submodules) {
      for (const submodule of module.submodules) {
        processModule(submodule, 'sous-module',module.name);
      }
    }
  };

  for (const module of modules) {
    processModule(module, 'module',null);
  }

  return result;
}

}
