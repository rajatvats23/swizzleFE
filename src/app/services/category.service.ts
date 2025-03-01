import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Category } from '../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpService) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/category');
  }

  addCategory(category: FormData): Observable<Category> {
    return this.http.post<Category>('/category', category);
  }

  updateCategory(id: number, category: FormData): Observable<Category> {
    return this.http.put<Category>(`/category/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/category/${id}`);
  }
}