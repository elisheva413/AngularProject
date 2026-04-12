import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../Services/order-service';
import { UserService } from '../../Services/user-service';
import { Order } from '../../Models/Order-Model';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-history.html',
  styleUrls: ['./orders-history.scss']
})
export class OrdersHistoryComponent implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // הפטיש של אנגולר!

  isAdmin: boolean = false;
  orders: Order[] = []; 
  openOrderId: number | null = null;
  isLoading: boolean = true;
  private userId!: number;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['orderSuccess'] === 'true') {
        this.openOrderId = -1; 
      }
    });

    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = this.userService.isAdmin();
        this.userId = this.userService.getUserId();
        this.loadOrderHistory();
      }
    });
  }

  loadOrderHistory() {
    this.isLoading = true;
    const orderRequest = this.isAdmin 
      ? this.orderService.getAllOrders() 
      : this.orderService.getUserOrders(this.userId);

    orderRequest.subscribe({
      next: (res) => {
        this.orders = [...res].sort((a, b) => b.orderId - a.orderId);
        
        this.orders.forEach(o => {
          if (localStorage.getItem('order_received_' + o.orderId) === 'true') {
            o.orderStatus = 'Received';
          }
        });

        if (this.openOrderId === -1 && this.orders.length > 0) {
          this.openOrderId = this.orders[0].orderId;
        }
        
        this.isLoading = false;
        this.cdr.detectChanges(); // פקודת רענון כפויה - פותר את באג תזוזת העכבר!
      },
      error: (err) => {
        console.error('שגיאה בטעינת הזמנות', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleOrder(orderId: number) {
    this.openOrderId = this.openOrderId === orderId ? null : orderId;
  }

  onStatusChange(order: Order, newStatus: string) {
    order.orderStatus = newStatus; 
    this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe({
      error: () => this.loadOrderHistory() 
    });
  }

  confirmArrival(order: Order) {
    order.orderStatus = 'Received'; 
    localStorage.setItem('order_received_' + order.orderId, 'true');
    this.orderService.updateOrderStatus(order.orderId, 'Received').subscribe({
      error: (err) => console.warn('הערת מערכת: ה-UI נעול בהצלחה', err)
    });
  }

  isDigitalOrder(order: Order): boolean {
    if (!order.ordersItems || order.ordersItems.length === 0) return false;
    return order.ordersItems.every(item => 
      item.productName.toLowerCase().includes('gift card') || 
      item.productName.includes('גיפט קארד')
    );
  }

  getProductImagePath(urlPath: string | undefined, productName: string = ''): string {
    if (!urlPath || urlPath.trim() === '') {
        return (productName.toLowerCase().includes('gift card')) ? '/images/GIFT-CARD.png' : '/images/no-image.png';
    }
    const cleanPath = urlPath.replace(/\\/g, '/');
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('assets/') || cleanPath.includes('dummy_')) {
        return cleanPath.includes('dummy_') ? '/images/GIFT-CARD.png' : '/' + cleanPath;
    }
    const apiBaseUrl = 'https://localhost:44360/';
    return cleanPath.startsWith('products/') ? `${apiBaseUrl}${cleanPath}` : `${apiBaseUrl}products/${cleanPath}`;
  }
}