import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Order } from '../Models/Order-Model'; // ודאי שהנתיב תקין

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44360/api/Orders'; // ודאי שזה תואם לקונטרולר (ברבים)

  // 1. "תשלום דמה" ויצירת הזמנה
  // הפונקציה מחכה 1.5 שניות ואז שולחת את ה-POST לשרת
  processFakePaymentAndCreateOrder(orderData: any): Observable<Order> {
    return of(null).pipe(
      delay(1500), // השהיה של 1.5 שניות לדימוי עיבוד
      switchMap(() => this.http.post<Order>(this.apiUrl, orderData))
    );
  }

  // 2. הבאת הזמנות של משתמש
  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 3. הבאת כל ההזמנות (למנהל)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  // 4. עדכון סטטוס (למנהל)
  updateOrderStatus(orderId: number, newStatus: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, `"${newStatus}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}