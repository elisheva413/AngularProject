
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, of } from 'rxjs';
import { ProductModel } from '../Models/Products-Model';

export type ProductsResponse = {
  items: ProductModel[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export interface ProductFilters {
  categoryId?: number | number[];
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  material?: string;
  inStock?: boolean;
  isActive?: boolean;
  sort?: string;
  skip?: number;
  position?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44360/api/Products';

  // הפונקציה המקורית לסינונים וגלילה
  getProducts(filters?: ProductFilters): Observable<ProductsResponse> {
    let params = new HttpParams();
    if (filters) {
      if (filters.categoryId != null) {
        if (Array.isArray(filters.categoryId)) {
          filters.categoryId.forEach(id => params = params.append('categoryId', id.toString()));
        } else {
          params = params.append('categoryId', filters.categoryId.toString());
        }
      }
      if (filters.q) params = params.set('q', filters.q);
      if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.color) params = params.set('color', filters.color);
      if (filters.material) params = params.set('material', filters.material);
      if (filters.inStock != null) params = params.set('inStock', filters.inStock.toString());
      if (filters.isActive != null) params = params.set('isActive', filters.isActive.toString());
      if (filters.sort) params = params.set('sort', filters.sort);
      if (filters.skip != null) params = params.set('skip', filters.skip.toString());
      if (filters.position != null) params = params.set('position', filters.position.toString());
    }
    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  // פונקציית הניהול המעודכנת - מחלצת את ה-items מתוך התשובה
  getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductsResponse>(this.apiUrl).pipe(
      map(res => res?.items || []),
      catchError(err => {
        console.error('שגיאה בשליפת מוצרים', err);
        return of([]); // מחזיר מערך ריק במקרה של שגיאה כדי למנוע קריסה
      })
    );
  }

  addProduct(product: ProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(err => throwError(() => new Error('מחיקה נכשלה')))
    );
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload-image`, formData);
  }

  getById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }
}