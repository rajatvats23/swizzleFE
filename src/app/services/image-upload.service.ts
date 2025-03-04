import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private http: HttpService) {}

  /**
   * Upload an image to the server
   * @param file Image file to upload
   * @param folder Optional folder to store the image in
   */
  uploadImage(file: File, folder: string = 'categories'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post<UploadResponse>(
      '/upload/image', 
      formData, 
      { folder }
    );
  }

  /**
   * Delete an image from the server
   * @param url Image URL to delete
   */
  deleteImage(url: string): Observable<void> {
    return this.http.delete<void>('/upload/image', { url });
  }
}