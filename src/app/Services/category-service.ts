import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44360/api/Categories';

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}