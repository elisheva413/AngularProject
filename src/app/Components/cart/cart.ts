//מקווה שסופייייי
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; 
import { CartService } from '../../Services/cart-service'; 
import { CartItem } from '../../Models/Cart-Model'; 
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private userService = inject(UserService); 
  private router = inject(Router); 
  
  cartItems: CartItem[] = [];

  readonly shippingThreshold = 299;
  readonly shippingCost = 39.90;

  ngOnInit() {
    this.cartService.cart$.subscribe(items => this.cartItems = items);
  }

  proceedToCheckout() {
    if (this.userService.isLoggedIn()) {
      console.log('משתמש מחובר, עובר לתשלום...');
      this.router.navigate(['/checkout']);
    } else {
      console.log('משתמש לא מחובר, שומר יעד ומעביר ללוגין');
      localStorage.setItem('returnUrl', '/checkout'); 
      this.router.navigate(['/login']); 
    }
  }

  // --- הפונקציה המשודרגת שעוצרת רעידות ומזהה גיפט קארד בדיוק לפי העיצוב! ---
  getProductImagePath(item: CartItem): string {
    const urlPath = item.product.imgUrl;
    const productName = item.product.productsName || '';

    // 1. הגנה כללית אם אין נתיב בכלל
    if (!urlPath || urlPath.trim() === '') return '/images/no-image.png';

    const cleanPath = urlPath.replace(/\\/g, '/');

    // 2. טיפול ב-Gift Card ספציפי שנבחר על ידי המשתמש (מגיע ישירות מתיקיית images באנגולר)
    // הוספנו הגנה גם אם זה מוצר שמכיל dummy במקרה ואיכשהו הגיע מה-DB (נדיר בסל, אבל שיהיה)
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('assets/') || cleanPath.includes('dummy_')) {
        // אם זה אכן מתחיל ב-images, אנחנו מוסיפים / בהתחלה כדי שהדפדפן תמיד ימצא את זה בשורש הפרויקט
        if (cleanPath.includes('dummy_')) {
            return '/images/GIFT-CARD.png'; // אם דמה - נציג כללי
        }
        return '/' + cleanPath; // פה יחזור הנתיב המדויק, למשל: /images/gift_card/gc2.webp
    }

    // 3. תמונות מוחלטות
    if (cleanPath.startsWith('/')) {
        return cleanPath;
    }

    // 4. מוצרים רגילים - משרת ה-C#
    const apiBaseUrl = 'https://localhost:44360/';
    if (cleanPath.startsWith('products/')) {
      return `${apiBaseUrl}${cleanPath}`;
    } else {
      return `${apiBaseUrl}products/${cleanPath}`;
    }
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getShippingCost(): number {
    return this.getTotalPrice() >= this.shippingThreshold ? 0 : this.shippingCost;
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.getShippingCost();
  }
}