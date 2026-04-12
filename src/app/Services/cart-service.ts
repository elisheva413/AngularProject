import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '../Models/Products-Model';
import { CartItem } from '../Models/Cart-Model';

@Injectable({ providedIn: 'root' })
export class CartService {
  
  // טוען את הסל מהלוקל סטורג' מיד כשהאפליקציה עולה
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  // 1. הוספה לסל (ובדיקת מלאי)
  addToCart(product: ProductModel, qty: number = 1) {
    let currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.productsId === product.productsId);
    
    const currentQtyInCart = existingItem ? existingItem.selectedQuantity : 0;
    const totalRequested = currentQtyInCart + qty;

    // בדיקת מלאי פשוטה
    if (totalRequested > product.quantity) {
      alert(`מצטערים, המלאי מוגבל ל-${product.quantity} יחידות`);
      return;
    }

    if (existingItem) {
      existingItem.selectedQuantity = totalRequested;
    } else {
      currentCart.push({ product, selectedQuantity: qty });
    }

    this.saveAndRefresh(currentCart);
  }

  // 2. עדכון כמות (הפונקציה שהייתה חסרה!)
  updateQuantity(productId: number, newQty: number) {
    let currentCart = this.cartSubject.value;
    const item = currentCart.find(i => i.product.productsId === productId);
    
    if (item) {
      if (newQty > item.product.quantity) {
        alert(`ניתן להזמין עד ${item.product.quantity} יחידות`);
        item.selectedQuantity = item.product.quantity;
      } else {
        item.selectedQuantity = newQty;
      }
      this.saveAndRefresh(currentCart);
    }
  }

  // 3. מחיקת פריט מהסל (הפונקציה שהייתה חסרה!)
  removeItem(productId: number) {
    const updatedCart = this.cartSubject.value.filter(item => item.product.productsId !== productId);
    this.saveAndRefresh(updatedCart);
  }

  // 4. חישוב סכום כולל (הפונקציה שהייתה חסרה!)
  getTotalPrice(): number {
    return this.cartSubject.value.reduce((total, item) => total + (item.product.price * item.selectedQuantity), 0);
  }

  // שומר ללוקל סטורג' ומעדכן את כולם
  private saveAndRefresh(cart: CartItem[]) {
    localStorage.setItem('p_cart', JSON.stringify(cart));
    this.cartSubject.next([...cart]);
  }

  // שולף מהלוקל סטורג'
  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('p_cart');
    return saved ? JSON.parse(saved) : [];
  }

  // פונקציה לריקון הסל אחרי רכישה מוצלחת
// cart-service.ts (מעודכן)
clearCart() {
  this.cartSubject.next([]);
  localStorage.removeItem('p_cart'); // איחוד שם המפתח
  console.log('🛒 הסל רוקן בהצלחה');
}
}