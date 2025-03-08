// src/app/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductCreate, ProductUpdate } from '../shared/interfaces/product.interface';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getProducts(params?: ProductQueryParams): Observable<ProductResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      
      if (params.limit !== undefined) {
        httpParams = httpParams.set('limit', params.limit.toString());
      }
      
      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
      }
      
      if (params.sortDirection) {
        httpParams = httpParams.set('sortDirection', params.sortDirection);
      }
      
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
      
      if (params.categoryId) {
        httpParams = httpParams.set('categoryId', params.categoryId);
      }
      
      if (params.vegetarian !== undefined) {
        httpParams = httpParams.set('vegetarian', params.vegetarian.toString());
      }
      
      if (params.vegan !== undefined) {
        httpParams = httpParams.set('vegan', params.vegan.toString());
      }
      
      if (params.glutenFree !== undefined) {
        httpParams = httpParams.set('glutenFree', params.glutenFree.toString());
      }
    }
    
    return this.http.get<ProductResponse>(this.baseUrl, { params: httpParams });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: string, product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}