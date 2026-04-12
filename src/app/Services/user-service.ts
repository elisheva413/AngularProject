import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { CartService } from './cart-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router); 
  private cartService = inject(CartService);
  private apiUrl = 'https://localhost:44360/api/Users'; 

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => this.saveUserToStorage(user))
    );
  }

  // עדכון משתמש מתוקן - שומר על המידע המעודכן בזמן אמת
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData).pipe(
      tap(() => {
        // עדכון המידע המקומי במידה והעדכון בשרת הצליח
        const current = this.currentUserSubject.value;
        this.saveUserToStorage({ ...current, ...userData });
      })
    );
  }

  saveUserToStorage(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage() {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserId(): number {
    return this.currentUserSubject.value?.userId || this.currentUserSubject.value?.UserID || this.currentUserSubject.value?.id || 0;
  }

  isAdmin(): boolean {
    const role = (this.currentUserSubject.value?.Role || this.currentUserSubject.value?.role || "").toLowerCase();
    return role === 'admin';
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.cartService.clearCart(); 
    this.router.navigate(['/login']);
  }
}