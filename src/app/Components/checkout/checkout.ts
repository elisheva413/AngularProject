import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // הוספנו את המודול הזה!
import { CartService } from '../../Services/cart-service';
import { OrderService } from '../../Services/order-service';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);
  private http = inject(HttpClient); // הזרקנו את ה-HttpClient

  cartItems: any[] = [];
  
  isSubmitting = false; 
  selectedPayment: 'credit' | 'paypal' | 'google' | '' = ''; 
  isSummaryOpen: boolean = false; 

  readonly SHIPPING_THRESHOLD = 299;
  readonly SHIPPING_COST = 39.90;

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getProductImagePath(item: any): string {
    const urlPath = item.product.imgUrl;
    
    if (!urlPath || urlPath.trim() === '') return '/images/no-image.png';

    const cleanPath = urlPath.replace(/\\/g, '/');

    if (cleanPath.startsWith('images/') || cleanPath.startsWith('assets/') || cleanPath.includes('dummy_')) {
        if (cleanPath.includes('dummy_')) {
            return '/images/GIFT-CARD.png'; 
        }
        return '/' + cleanPath; 
    }

    if (cleanPath.startsWith('/')) {
        return cleanPath;
    }

    const apiBaseUrl = 'https://localhost:44360/';
    if (cleanPath.startsWith('products/')) {
      return `${apiBaseUrl}${cleanPath}`;
    } else {
      return `${apiBaseUrl}products/${cleanPath}`;
    }
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getShippingCost(): number {
    return this.getTotalPrice() >= this.SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.getShippingCost();
  }

  togglePayment(method: 'credit' | 'paypal' | 'google') {
    if (this.selectedPayment === method) {
      this.selectedPayment = '';
    } else {
      this.selectedPayment = method;
    }
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      alert('הסל שלך ריק!');
      return;
    }

    this.isSubmitting = true;

    const newOrder = {
      orderDate: new Date().toISOString().split('T')[0], 
      orderSum: this.getFinalTotal(),
      userId: this.userService.getUserId(),
      orderStatus: 'Paid', 
      ordersItems: this.cartItems.map(item => ({
        productsId: item.product.productsId,
        quantity: item.selectedQuantity
      }))
    };

    this.orderService.processFakePaymentAndCreateOrder(newOrder).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.cartService.clearCart();

        // -------------------------------------------------------------
        // הלוגיקה החדשה: בדיקה ושליחת גיפט קארד *אחרי* התשלום!
        // -------------------------------------------------------------
        const pendingEmailData = sessionStorage.getItem('pendingGiftCardEmail');
        
        if (pendingEmailData) {
          const emailData = JSON.parse(pendingEmailData);
          
          // שולחים את המייל דרך השרת
          this.http.post('https://localhost:44360/api/Email/send-giftcard', emailData).subscribe({
            next: () => {
              console.log('מייל גיפט קארד נשלח בהצלחה למקבל!');
              sessionStorage.removeItem('pendingGiftCardEmail'); // מוחקים מהזיכרון כדי שלא יישלח שוב בטעות
            },
            error: (err) => {
              console.error('שגיאה בשליחת מייל גיפט קארד:', err);
              sessionStorage.removeItem('pendingGiftCardEmail'); // מוחקים בכל מקרה
            }
          });
        }
        // -------------------------------------------------------------

        // עוברים לעמוד ההזמנות שלי עם הודעת הצלחה
        this.router.navigate(['/profile/orders'], { queryParams: { orderSuccess: 'true' } });
      },
      error: (err) => {
        console.error('❌ שגיאה ביצירת הזמנה:', err);
        this.isSubmitting = false;
        alert('חלה שגיאה בעיבוד ההזמנה בשרת. ודאי שה-API פועל וה-Database מחובר.');
      }
    });
  }
}