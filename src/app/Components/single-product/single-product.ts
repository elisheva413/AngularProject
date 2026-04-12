import { ActivatedRoute, RouterLink, Router } from '@angular/router'; 
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../Services/product-service';
import { ProductModel } from '../../Models/Products-Model';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core'; 
import { CATEGORY_DICTIONARY } from '../../Models/categories.const';
import { CartService } from '../../Services/cart-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './single-product.html',
  styleUrl: './single-product.scss',
})
export class SingleProduct implements OnInit {
  
  private cartService = inject(CartService); 

  product: ProductModel | null = null;
  loading = true;
  errorMsg = '';
  selectedImage: 'imgUrl' | 'imgUrl2' = 'imgUrl';
  qty = 1;
  breadcrumbLabel: string = 'כל המוצרים';
  isAdded: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private productService: ProductService,
    private cdr: ChangeDetectorRef 
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['fromLabel']) {
      this.breadcrumbLabel = navigation.extras.state['fromLabel'];
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!id) {
      this.loading = false;
      this.errorMsg = 'מזהה מוצר לא תקין';
      return;
    }

    this.loading = true;
    
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.selectedImage = 'imgUrl';

        if (this.breadcrumbLabel === 'כל המוצרים' && p.categoryId) {
          const categoryEntry = CATEGORY_DICTIONARY[p.categoryId];
          if (categoryEntry) {
            this.breadcrumbLabel = categoryEntry.title;
          }
        }

        this.loading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('שגיאה:', err);
        this.loading = false;
        this.errorMsg = 'לא הצלחנו לטעון את המוצר';
        this.cdr.detectChanges();
      },
    });
  }

  // --- הפונקציה החדשה שמטפלת בנתיבי השרת ---
  private getImageUrlFromServer(urlPath: string | undefined): string {
    if (!urlPath) return 'assets/images/placeholder.png'; 

    const cleanPath = urlPath.replace(/\\/g, '/');
    const apiBaseUrl = 'https://localhost:44360/';

    if (cleanPath.startsWith('products/')) {
      return `${apiBaseUrl}${cleanPath}`;
    } else {
      return `${apiBaseUrl}products/${cleanPath}`;
    }
  }

  // כל ה-Getters שלך נשארו, רק קוראים לפונקציה החדשה
  get mainImageSrc(): string {
    if (!this.product) return '';
    const url = this.selectedImage === 'imgUrl2' && this.product.imgUrl2 ? this.product.imgUrl2 : this.product.imgUrl;
    return this.getImageUrlFromServer(url);
  }

  get thumb1(): string {
    return this.getImageUrlFromServer(this.product?.imgUrl);
  }

  get thumb2(): string {
    return this.getImageUrlFromServer(this.product?.imgUrl2);
  }

  selectImg(which: 'imgUrl' | 'imgUrl2') { this.selectedImage = which; }
  dec() { if (this.qty > 1) this.qty--; }
  inc() { this.qty++; }

  addToCart() {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product, this.qty); 
    
    this.isAdded = true;
    setTimeout(() => {
      this.isAdded = false;
      this.cdr.detectChanges(); 
    }, 800);
  }
}

