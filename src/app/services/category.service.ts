import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Category, CategoryCreate, CategoryUpdate } from '../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpService);
  private apiPath = '/category';

  /**
   * Get all categories
   * @returns Observable of categories array
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiPath);
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Observable of category
   */
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiPath}/${id}`);
  }

  /**
   * Add a new category
   * @param category Category data
   * @returns Observable of created category
   */
  addCategory(category: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(this.apiPath, category);
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param category Updated category data
   * @returns Observable of updated category
   */
  updateCategory(id: string, category: CategoryUpdate): Observable<Category> {
    return this.http.put<Category>(`${this.apiPath}/${id}`, category);
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns Observable of void
   */
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }
}