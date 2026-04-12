import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
 adminCards = [
    { title: 'ניהול מוצרים', icon: 'pi pi-box', route: '/admin/products', color: '#6366f1' },
    { title: 'ניהול הזמנות', icon: 'pi pi-shopping-cart', route: '/admin/orders', color: '#10b981' } // התיקון כאן!
  ];
}