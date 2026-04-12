import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user-service'; // ודאי שהנתיב לתיקיית Services נכון

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  private userService = inject(UserService); // הזרקת השירות לבדיקת משתמש
  openSection: string = ''; 

  // מחזיר נתיב להתחברות או לפרופיל בהתאם למצב המשתמש
  get accountLink(): string {
    return this.userService.isLoggedIn() ? '/profile/edit' : '/login';
  }

  get ordersLink(): string {
    return this.userService.isLoggedIn() ? '/profile/orders' : '/login';
  }

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? '' : section;
  }
}
