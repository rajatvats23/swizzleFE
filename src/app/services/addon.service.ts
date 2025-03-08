// // src/app/services/addon.service.ts
// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { AddOn, AddOnCreate, AddOnUpdate } from '../shared/interfaces/product.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class AddonService {
//   private http = inject(HttpClient);
//   private baseUrl = `${environment.apiUrl}/products`;

//   getAddons(): Observable<AddOn[]> {
//     return this.http.get<AddOn[]>(`${this.baseUrl}/addons`);
//   }

//   createAddon(addon: AddOnCreate): Observable<AddOn> {
//     return this.http.post<AddOn>(`${this.baseUrl}/addon`, addon);
//   }

//   updateAddon(id: string, addon: AddOnUpdate): Observable<AddOn> {
//     return this.http.put<AddOn>(`${this.baseUrl}/addon/${id}`, addon);
//   }

//   deleteAddon(id: string): Observable<{ message: string }> {
//     return this.http.delete<{ message: string }>(`${this.baseUrl}/addon/${id}`);
//   }
// }