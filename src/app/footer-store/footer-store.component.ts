import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer-store',
  templateUrl: './footer-store.component.html',
  styleUrls: ['./footer-store.component.css']
})
export class FooterStoreComponent implements OnInit {

  storeData:any;
  currentYear:any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStoreData();
    this.currentYear = this.getCurrentYear();
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
    });
  }

  getCurrentYear(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return currentYear;
  }

}
