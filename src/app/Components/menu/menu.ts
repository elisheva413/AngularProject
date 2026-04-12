import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { filter } from 'rxjs/operators';
import { CartService } from '../../Services/cart-service';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone: true,
  imports: [CommonModule, MenubarModule, MenuModule, RouterModule, FormsModule] 
})
export class Menu implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);
  private userService = inject(UserService);

  // --- משתני נתונים ---
  cartItemCount: number = 0;
  userMenuItems: MenuItem[] | undefined; 
  searchQuery: string = '';
  isAdmin: boolean = false; 

  // --- משתני עיצוב וגלילה ---
  isHeaderHidden = false; 
  isScrolled = false; 
  lastScrollTop = 0; 
  isHomePage = false; 
  isTransparent = false; 

  ngOnInit() {
    // 1. האזנה לשינויי נתיב (עבור שקיפות ההדר בעמוד הבית)
    const checkRoute = (url: string) => {
      const cleanUrl = url.split('#')[0].split('?')[0]; 
      this.isHomePage = cleanUrl === '/' || cleanUrl === '' || cleanUrl === '/home';
      this.checkTransparency();
    };

    checkRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      checkRoute(event.urlAfterRedirects || event.url);
    });

    // 2. ניהול מונה המוצרים בסל
    this.cartService.cart$.subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + item.selectedQuantity, 0);
    });

    // 3. ניהול תפריט משתמש דינמי (הלוגיקה החדשה והנקייה)
    this.userService.currentUser$.subscribe(user => {
      this.isAdmin = this.userService.isAdmin(); // בודק אם המחובר הוא אדמין

      if (user) {
        const displayName = user.firstName || user.FirstName || user.UserName || 'משתמש';
        if (this.isAdmin) {
          // תפריט למנהל: פרטים אישיים והתנתקות (ניהול נמצא בגלגל השיניים)
          this.userMenuItems = [
            { 
                label: `מחובר כמנהל, ${displayName}`, 
                icon: 'pi pi-user-edit', 
                routerLink: '/profile/edit' // שליחה לעריכת פרטים
            },
            { 
                label: 'התנתקות מהמערכת', 
                icon: 'pi pi-sign-out', 
                command: () => this.logout() 
            }
          ];
        } else {
          // תפריט למשתמש רגיל: כל הלוגיקה המקורית והיקרה שלך
          this.userMenuItems = [
            { 
              label: `שלום, ${displayName}`, 
              icon: 'pi pi-user', 
              routerLink: '/profile' 
            },
            { 
              label: 'ההזמנות שלי', 
              icon: 'pi pi-history', 
              routerLink: '/profile/orders'
            },
            { 
              label: 'התנתקות', 
              icon: 'pi pi-sign-out', 
              command: () => this.logout() 
            }
          ];
        }
      } else {
        // תפריט למשתמש לא מחובר
        this.userMenuItems = [
          { label: 'כניסה והרשמה', icon: 'pi pi-sign-in', routerLink: '/login' }
        ];
      }
    });
  }

  // --- פונקציות גלילה ---
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    this.isScrolled = currentScroll > 50;
    this.checkTransparency(); 

    if (currentScroll <= 50) {
      this.isHeaderHidden = false;
      this.lastScrollTop = currentScroll;
      return;
    }

    if (currentScroll > this.lastScrollTop) {
      this.isHeaderHidden = true; 
    } else {
      this.isHeaderHidden = false; 
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  checkTransparency() {
    this.isTransparent = this.isHomePage && !this.isScrolled;
  }

  // --- פעולות חיפוש והתנתקות ---
  onSearch() {
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = ''; 
    }
  }

  logout() {
    this.userService.logout();
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}