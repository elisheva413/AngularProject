import { Component, inject, signal, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { RouterOutlet, RouterModule, RouterLink, Router, NavigationEnd } from '@angular/router'; 
import { Menu } from './Components/menu/menu';
import { CartService } from './Services/cart-service'; 
import { FooterComponent } from './Components/footer/footer';
import { Button } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    CommonModule, 
    FooterComponent, 
    Menu,
    Button, 
    Menubar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  public cartService = inject(CartService);
  private router = inject(Router); // הזרקת הראוטר
  
  protected readonly title = signal('Shop_Project');
  isNetfreePage: boolean = false; // משתנה שיקבע אם להציג את התפריטים
  
  openSection: string = ''; 

  ngOnInit() {
    // האזנה לשינויי נתיב - בכל פעם שהכתובת משתנה הבדיקה תרוץ
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // אם הנתיב הוא netfree, המשתנה יהיה true
      this.isNetfreePage = event.urlAfterRedirects.includes('/netfree');
    });
  }

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? '' : section;
  }
}