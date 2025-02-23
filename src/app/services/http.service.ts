  import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
  import { Injectable, inject } from '@angular/core';
  import { Observable, catchError, throwError } from 'rxjs';
  import { environment } from '../../environments/environment';

  type QueryParams = Record<string, string | number | boolean | (string | number | boolean)[]>;

  @Injectable({
    providedIn: 'root'
  })
  export class HttpService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    get<T>(path: string, params?: QueryParams): Observable<T> {
      return this.http
        .get<T>(`${this.apiUrl}${path}`, { params: this.toHttpParams(params) })
        .pipe(catchError(this.handleError));
    }

    post<T>(path: string, body: unknown, params?: QueryParams): Observable<T> {
      return this.http
        .post<T>(`${this.apiUrl}${path}`, body, { params: this.toHttpParams(params) })
        .pipe(catchError(this.handleError));
    }

    put<T>(path: string, body: unknown, params?: QueryParams): Observable<T> {
      return this.http
        .put<T>(`${this.apiUrl}${path}`, body, { params: this.toHttpParams(params) })
        .pipe(catchError(this.handleError));
    }

    delete<T>(path: string, params?: QueryParams): Observable<T> {
      return this.http
        .delete<T>(`${this.apiUrl}${path}`, { params: this.toHttpParams(params) })
        .pipe(catchError(this.handleError));
    }

    private toHttpParams(params?: QueryParams): HttpParams {
      if (!params) return new HttpParams();

      return Object.entries(params).reduce((httpParams, [key, value]) => {
        if (Array.isArray(value)) {
          return value.reduce((params, item) => params.append(key, String(item)), httpParams);
        }
        return httpParams.append(key, String(value));
      }, new HttpParams());
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
      const message = error.status === 410
        ? 'Your session has expired. Please try again.'
        : 'Something went wrong. Please try again later.';
      
      return throwError(() => message);
    }
  }