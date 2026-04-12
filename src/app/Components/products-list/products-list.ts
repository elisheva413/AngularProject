import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { ProductModel } from '../../Models/Products-Model';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { CATEGORY_DICTIONARY } from '../../Models/categories.const';
import { ProductsResponse } from '../../Models/ProductApi-Model'; 
import { ProductService } from '../../Services/product-service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCard, ProductFilter], 
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList implements OnInit {
  products: ProductModel[] = [];
  isLoading = false;
  errorMsg = '';
  totalCount = 0;

  isFilterSidebarOpen = false;

  currentTitle = '';
  currentDesc = '';
  searchQuery = ''; 
  isExpanded = false; 
  descMaxLength = 130; 

  // מערך שישמור אילו חומרים מסומנים כרגע
  selectedMaterials: string[] = [];

  // --- משתנים לגלילה אינסופית (Infinite Scroll) ---
  currentPage: number = 1; // העמוד הנוכחי שאנחנו נמצאים בו
  isLoadingMore: boolean = false; // האם אנחנו טוענים עכשיו עוד מוצרים בגלילה?
  hasMoreProducts: boolean = true; // האם נשארו עוד מוצרים בשרת?
  currentFilters: any = {}; // שומר את הסינון הנוכחי

  constructor(
    private productservice: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.handleHeaderDisplay(params); 
      
      if (params['material']) {
        this.selectedMaterials = params['material'].split(',');
      } else {
        this.selectedMaterials = [];
      }

      this.loadProducts(params);
    });
  }

  toggleMaterial(materialValue: string, event: any): void {
    if (event.target.checked) {
      this.selectedMaterials.push(materialValue);
    } else {
      this.selectedMaterials = this.selectedMaterials.filter(m => m !== materialValue);
    }

    const materialParam = this.selectedMaterials.length > 0 ? this.selectedMaterials.join(',') : null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { material: materialParam },
      queryParamsHandling: 'merge' 
    });
  }

  handleHeaderDisplay(params: any): void {
    this.isExpanded = false; 

    if (params['q']) {
      this.searchQuery = params['q'];
      this.currentTitle = '';
      this.currentDesc = '';
    } 
    else if (params['categoryId']) {
      this.searchQuery = '';
      const id = Number(params['categoryId']);
      
      if (CATEGORY_DICTIONARY[id]) {
        this.currentTitle = CATEGORY_DICTIONARY[id].title;
        this.currentDesc = CATEGORY_DICTIONARY[id].desc;
      } else {
        this.currentTitle = 'מוצרים';
        this.currentDesc = '';
      }
    } 
    else {
      this.searchQuery = '';
      this.currentTitle = 'מוצרים';
      this.currentDesc = '';
    }
  }

  toggleDesc(): void {
    this.isExpanded = !this.isExpanded;
  }

  onApplyFilters(filters: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: filters.minPrice !== 0 ? filters.minPrice : null, 
        maxPrice: filters.maxPrice !== 1700 ? filters.maxPrice : null, 
        color: filters.color ? filters.color : null,
        material: filters.material ? filters.material : null
      },
      queryParamsHandling: 'merge' 
    });
  }
  
  // --- הפונקציה המעודכנת (עם התיקון הקריטי להגנת הלקוחות!) ---
  loadProducts(filters: any = {}, isAppend: boolean = false): void {
    this.currentFilters = filters; // שומרים את הסינון לשימוש בזמן גלילה

    if (isAppend) {
      this.isLoadingMore = true;
    } else {
      this.isLoading = true;
      this.currentPage = 1;
      this.hasMoreProducts = true; 
    }
    this.errorMsg = '';
    
    // התיקון: מוסיפים לבקשה את העמוד, וגם מכריחים את השרת להחזיר רק מוצרים פעילים!
    const apiFilters = { 
        ...filters, 
        position: this.currentPage,
        isActive: true // <--- הלקוחות רואים אך ורק מוצרים פעילים
    };

    this.productservice.getProducts(apiFilters).subscribe({
      next: (res: any) => { 
        console.log('הנתונים שהגיעו מהשרת:', res); 
        
        if (res && res.items) {
          if (isAppend) {
            // אם גוללים - מדביקים את הנתונים החדשים בסוף המערך הקיים
            this.products = [...this.products, ...res.items];
          } else {
            // טעינה רגילה - מחליפים את המערך
            this.products = res.items;
          }
          
          this.totalCount = res.totalCount || res.total || 0;

          // בודקים אם הגענו לסוף
          if (this.products.length >= this.totalCount || res.hasNext === false || res.items.length === 0) {
            this.hasMoreProducts = false;
          }
        } else {
          if (!isAppend) {
            this.products = [];
            this.totalCount = 0;
          }
          this.hasMoreProducts = false;
        }
        
        this.isLoading = false;
        this.isLoadingMore = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('טעינת מוצרים נכשלה', err);
        this.errorMsg = 'לא הצלחנו לטעון מוצרים';
        this.isLoading = false;
        this.isLoadingMore = false;
        this.cdr.detectChanges(); 
      },
    });
  }

  // --- פונקציית ההאזנה לגלילה ---
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoading || this.isLoadingMore || !this.hasMoreProducts) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollPosition >= documentHeight - 400) {
      this.currentPage++;
      this.loadProducts(this.currentFilters, true);
    }
  }

// פונקציית עזר לבדיקה אם יש סינונים פעילים ב-URL
  hasActiveFilters(): boolean {
    const params = this.route.snapshot.queryParams;
    return !!(params['material'] || params['color'] || params['minPrice'] || params['maxPrice']);
  }
    // --- הפונקציה החדשה לניקוי סינונים ---
  clearFiltersAndShowAll(): void {
    this.selectedMaterials = [];
    this.searchQuery = ''; 
    
    // מנקה את כל הסינונים מה-URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { material: null, color: null, minPrice: null, maxPrice: null, q: null },
      queryParamsHandling: 'merge'
    });
  }

  onAddToCart(p: ProductModel) {
    console.log('Add to cart:', p);
  }

  trackById(_index: number, item: ProductModel) {
    return item.productsId;
  }
}