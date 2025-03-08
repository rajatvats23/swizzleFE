// src/app/services/addon.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Addon, AddonCreate, AddonUpdate } from '../shared/interfaces/addon.interface';

export interface AddonQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  addonType?: 'topping' | 'sauce' | 'extra' | 'option';
  selectionType?: 'single' | 'multiple';
  productId?: string;
}

export interface AddonResponse {
  data: Addon[];
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
export class AddonService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/addons`;

  getAddons(params?: AddonQueryParams): Observable<AddonResponse> {
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
      
      if (params.addonType) {
        httpParams = httpParams.set('addonType', params.addonType);
      }
      
      if (params.selectionType) {
        httpParams = httpParams.set('selectionType', params.selectionType);
      }
      
      if (params.productId) {
        httpParams = httpParams.set('productId', params.productId);
      }
    }
    
    return this.http.get<AddonResponse>(this.baseUrl, { params: httpParams });
  }

  getAddonsByType(type: string): Observable<Addon[]> {
    return this.http.get<Addon[]>(`${this.baseUrl}/type/${type}`);
  }

  getAddonsByProduct(productId: string): Observable<Addon[]> {
    return this.http.get<Addon[]>(`${this.baseUrl}/product/${productId}`);
  }

  getAddonById(id: string): Observable<Addon> {
    return this.http.get<Addon>(`${this.baseUrl}/${id}`);
  }

  createAddon(addon: AddonCreate): Observable<Addon> {
    return this.http.post<Addon>(this.baseUrl, addon);
  }

  updateAddon(id: string, addon: AddonUpdate): Observable<Addon> {
    return this.http.put<Addon>(`${this.baseUrl}/${id}`, addon);
  }

  deleteAddon(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}