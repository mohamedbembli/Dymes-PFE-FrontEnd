import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ProductService } from '../services/product.service';
import { Chart, registerables } from 'chart.js';


@Component({
  selector: 'app-statistic-module',
  templateUrl: './statistic-module.component.html',
  styleUrls: ['./statistic-module.component.css']
})
export class StatisticModuleComponent implements OnInit {
  ordersList:any=null;

  confirmedOrders:any=null;
  confirmedOrderRate:any=null;

  shippedOrders:any=null;
  shippedOrdersValue:any=0;

  deliveredOrders:any=null;
  deliveredOrderRate:any=null;
  deliveredOrdersValue:any=0;

  benefits:any=0;

  returnedOrders:any=null;
  returnedOrderRate:any=null;

  

  productsList:any=null;
  clientList:any=null;

  ordersPerDay: any = {};



  constructor(private adminService: AdminService, private productService:ProductService) { }

  ngOnInit(): void {

    // Register Chart.js plugins
    Chart.register(...registerables);

    this.loadAllOrders();
    this.loadAllProducts();
    this.loadAllClients();
  }

   parseOrdersPerDay() {
    this.ordersList.forEach((order:any) => {
      const date = order.date.split(' ')[0]; // Extract date component
      if (this.ordersPerDay[date]) {
        this.ordersPerDay[date]++;
      } else {
        this.ordersPerDay[date] = 1;
      }
    });
  }

   renderChart() {
    const labels = Object.keys(this.ordersPerDay);
    const data = Object.values(this.ordersPerDay);

    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("Canvas element not found");
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Toutes les commandes',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  calculateOrderStatusCounts(): { [status: string]: number } {
    const statusCounts: { [status: string]: number } = {
      'Annulée': 0,
      'Confirmée': 0,
      'En attente': 0
    };

    this.ordersList.forEach((order:any) => {
      const status = order.status;
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    return statusCounts;
  }

  renderChartOrdersByStatus(){
    const orderStatusCounts = this.calculateOrderStatusCounts();

    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Annulée', 'Confirmée', 'En attente'],
        datasets: [{
          label: 'Toutes les commandes',
          data: [
            orderStatusCounts['Annulée'] || 0,
            orderStatusCounts['Confirmée'] || 0,
            orderStatusCounts['En attente'] || 0
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // Red for 'Annulée'
            'rgba(54, 162, 235, 0.2)', // Blue for 'Confirmée'
            'rgba(255, 206, 86, 0.2)' // Yellow for 'En attente'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  


  loadAllOrders(){
    this.adminService.loadAllOrders().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.ordersList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.ordersList = null;
        }
        else {
            this.ordersList = res;
            this.getConfirmedOrders();
            this.getShippedOrders();
            this.getShippingRate();
            this.getReturnedRate();
            // number of orders per day
            this.parseOrdersPerDay();
            this.renderChart();
            // orders cout by status "Annulée, Confirmée,En attente"
            this.calculateOrderStatusCounts();
            this.renderChartOrdersByStatus();
            // calculate average order value per day
            const ordersPerDay = this.calculateOrdersPerDay();
            this.renderChartAVGOrdersPerDay(ordersPerDay);

          }
      }
      else {
        console.log("Response is null or undefined");
        this.ordersList = null;
      }
    });
  }

  getConfirmedOrders(){
    this.confirmedOrders = this.ordersList.filter((order:any) => order.status.toLowerCase() === 'confirmée');
    this.confirmedOrderRate = (this.confirmedOrders.length / this.ordersList.length) * 100;
  }

  getShippedOrders(){
    this.shippedOrdersValue = 0;
    this.shippedOrders = this.ordersList.filter((order:any) => order.status.toLowerCase() === 'expédiée');
    this.shippedOrders.forEach((order:any) => {
      order.myOrderProductsData.forEach((orderProductsData:any) => {
        this.shippedOrdersValue+=orderProductsData.total;
      });
    });
  }

  getShippingRate(){
    this.deliveredOrders = this.ordersList.filter((order:any) => order.status.toLowerCase() === 'livrée');
    this.deliveredOrderRate = (this.deliveredOrders.length / this.ordersList.length) * 100;
  }

  getReturnedRate(){
    this.returnedOrders = this.ordersList.filter((order:any) => order.status.toLowerCase() === 'retour reçue' || order.status.toLowerCase() === 'retour non reçue');
    this.returnedOrderRate = (this.returnedOrders.length / this.ordersList.length) * 100;
  }

  getDeliveredOrdersValue(){
    this.deliveredOrdersValue = 0;
    this.deliveredOrders = this.ordersList.filter((order:any) => order.status.toLowerCase() === 'livrée');
    this.deliveredOrders.forEach((order:any) => {
      order.myOrderProductsData.forEach((orderProductsData:any) => {
        this.deliveredOrdersValue+=orderProductsData.total;
      });
    });   
    return this.deliveredOrdersValue; 
  }

  getBenefits(): number {
    let benefits = 0;

    this.deliveredOrders = this.ordersList.filter((order: any) => order.status.toLowerCase() === 'livrée');
    
    this.deliveredOrders.forEach((order: any) => {
        order.myOrderProductsData.forEach((orderProductsData: any) => {
          if (orderProductsData.type == "product"){
            const product = this.productsList.find((item: any) => item.id === orderProductsData.product_id);
            if (product ) {
              benefits += orderProductsData.total - product.buyPrice;
            }
          }
          else{
            this.productsList.forEach((product: any) =>{
               
                  const variant = product.variants.find((item: any) => item.id === orderProductsData.product_id);
                  if (variant) {
                    benefits += orderProductsData.total - product.buyPrice;
                  }
                });
          }
        });
        benefits = benefits - order.shippingFees;
    }); 

    return benefits;
}

renderChartAVGOrdersPerDay(ordersPerDay: Map<string, number[]>) {
  const labels = Array.from(ordersPerDay.keys());
  const data = labels.map(date => {
    const orders = ordersPerDay.get(date);
    if (orders && orders.length > 0) {
      const total = orders.reduce((acc, cur) => acc + cur, 0);
      return total / orders.length; // Calculate average order value per day
    } else {
      return 0; // Return 0 if there are no orders or orders is undefined
    }
  });

  const ctx = document.getElementById('chartAVGOrdersPerDay') as HTMLCanvasElement;
  const orderChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Moyenne de vente / jour (en TND)',
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


calculateOrdersPerDay(): Map<string, number[]> {
  const ordersPerDayMap = new Map<string, number[]>();

  this.ordersList.forEach((order:any) => {
    const date = order.date.split(' ')[0]; // Extracting date part only
    if (!ordersPerDayMap.has(date)) {
      ordersPerDayMap.set(date, []);
    }
    const ordersForDate = ordersPerDayMap.get(date);
    if (ordersForDate) {
      ordersForDate.push(order.totalWithTax);
    }
  });

  return ordersPerDayMap;
}




  loadAllProducts(){
    this.productService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.productsList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
        }
        else {
          this.productsList = res;
          this.renderMostSoldProductsChart();
          this.renderTopRatedProductsChart();
        }
      }
      else {
        console.log("Response is null or undefined");
        this.productsList = null;
      }
       
    });
  }

  loadAllClients(){
    this.adminService.loadClients().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.clientList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
        }
        else {
          this.clientList = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.clientList = null;
      }
       
    });
  }

  renderMostSoldProductsChart() {
    const productCounts = new Map<number, number>();

    // Parcourir toutes les commandes pour compter le nombre de fois que chaque produit a été vendu
    this.ordersList.forEach((order:any) => {
      order.myOrderProductsData.forEach((product:any) => {
        const productId = product.product_id;
        const count = productCounts.get(productId) || 0;
        productCounts.set(productId, count + 1);
      });
    });

    // Trier les produits par nombre de ventes
    const sortedProducts = Array.from(productCounts.entries()).sort((a, b) => b[1] - a[1]);

    // Prendre les trois produits les plus vendus
    const topThreeProducts = sortedProducts.slice(0, 3);

    // Récupérer les détails des produits les plus vendus
    const labels: string[] = [];
    const data: number[] = [];


    // product case
    topThreeProducts.forEach(([productId, count]) => {
      const product = this.productsList.find((p:any) => p.id === productId);
      if (product) {
        labels.push(product.name);
        data.push(count);
      }
    });
     // variant case
     topThreeProducts.forEach(([productId, count]) => {
      this.productsList.forEach((p:any) => {
        const variant = p.variants.find((v:any) => v.id === productId);
        if (variant) {
          labels.push(p.name);
          data.push(count);
        }
      });
    }); 

    

    // Créer le graphique
    const ctx = document.getElementById('mostSoldProductsChart') as HTMLCanvasElement;
    const mostSoldProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de ventes',
          data: data,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderTopRatedProductsChart() {
    if (this.productsList.length === 0) {
      console.error("No products available to render chart.");
      return;
    }
  
    // Sort products by average rating
    const sortedProducts = this.productsList.sort((a:any, b:any) => {
      const avgRatingA = this.calculateAverageRating(a.ratings);
      const avgRatingB = this.calculateAverageRating(b.ratings);
      return avgRatingB - avgRatingA;
    });
  
    // Take the top three rated products
    const topThreeProducts = sortedProducts.slice(0, 3);
  
    // Extract labels (product names) and data (average ratings)
    const labels = topThreeProducts.map((product:any) => product.name);
    const data = topThreeProducts.map((product:any) => this.calculateAverageRating(product.ratings));
  
    // Create the chart
    const ctx = document.getElementById('topRatedProductsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("Could not find canvas element to render chart.");
      return;
    }
    
    const topRatedProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Note moyenne du produit',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 5 // Assuming ratings are out of 5
          }
        }
      }
    });
  }
  
  calculateAverageRating(ratings: any[]): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    
    const totalStars = ratings.reduce((total, rating) => total + rating.stars, 0);
    return totalStars / ratings.length;
  }
  
}
