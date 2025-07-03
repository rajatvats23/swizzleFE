import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag, TagCreateDto, TagUpdateDto } from '../products/product.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tags`;

  getTags(): Observable<ApiResponse<{ tags: Tag[] }>> {
    return this.http.get<ApiResponse<{ tags: Tag[] }>>(this.baseUrl);
  }

  createTag(data: TagCreateDto): Observable<ApiResponse<{ tag: Tag }>> {
    return this.http.post<ApiResponse<{ tag: Tag }>>(this.baseUrl, data);
  }

  updateTag(id: string, data: TagUpdateDto): Observable<ApiResponse<{ tag: Tag }>> {
    return this.http.put<ApiResponse<{ tag: Tag }>>(`${this.baseUrl}/${id}`, data);
  }

  deleteTag(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}