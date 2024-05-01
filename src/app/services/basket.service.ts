import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private totalPrices: any;
  private totalWithTax!: number;
  private shippingFees:any;
  private isPromoCodeSet:any;
  private promotion:any;

  constructor() { }

  setPromotion(promotion:any){
    this.promotion = promotion;
  }

  getPromotion(){
    return this.promotion;
  }

  setIsPromoCodeSet(isPromoCodeSet:any){
    this.isPromoCodeSet = isPromoCodeSet;
  }

  getIsPromoCodeSet(){
    return this.isPromoCodeSet;
  }

  setShippingFees(shippingFees:any){
    this.shippingFees = shippingFees;
  }

  getShippingFees(){
    return this.shippingFees;
  }
  
  setTotalPrices(totalPrices: any) {
    this.totalPrices = totalPrices;
  }

  getTotalPrices() {
    return this.totalPrices;
  }

  setTotalWithTax(totalWithTax: number) {
    this.totalWithTax = totalWithTax;
  }

  getTotalWithTax() {
    return this.totalWithTax;
  }
}
