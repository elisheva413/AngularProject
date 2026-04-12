// נסיון קוד חדש מהגמיני
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../Models/Products-Model';
import { CartService } from '../../Services/cart-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements OnChanges {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  
  @Input() product!: ProductModel;
  @Output() addToCart = new EventEmitter<ProductModel>();

  isAltImage = false;
  currentImageSrc = 'assets/images/placeholder.png'; 
  isAddedToCart = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) { this.calculateImage(); }
  }

  onEnter() { this.isAltImage = true; this.calculateImage(); }
  onLeave() { this.isAltImage = false; this.calculateImage(); }
  
  onTouchToggle(event: TouchEvent) {
    this.isAltImage = !this.isAltImage;
    this.calculateImage();
  }

  onAddToCartClick(event: MouseEvent) {
    event.stopPropagation(); 
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.isAddedToCart = true;
      setTimeout(() => {
        this.isAddedToCart = false;
        this.cdr.detectChanges();
      }, 400);
    }
  }

  // הפונקציה היחידה ששונתה - ה"מוח" שמביא את התמונה מהשרת שלך
  private calculateImage(): void {
    if (!this.product) return;
    
    const url = this.isAltImage && this.product.imgUrl2 ? this.product.imgUrl2 : this.product.imgUrl;
    
    if (!url) { 
      this.currentImageSrc = 'assets/images/placeholder.png'; 
      return; 
    }

    const cleanPath = url.replace(/\\/g, '/');
    const apiBaseUrl = 'https://localhost:44360/';

    if (cleanPath.startsWith('products/')) {
      this.currentImageSrc = `${apiBaseUrl}${cleanPath}`;
    } else {
      this.currentImageSrc = `${apiBaseUrl}products/${cleanPath}`;
    }
  }
}