import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private isRefreshing = false;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip adding token for login, forgot password, and refresh token endpoints
    if (this.isAuthRequest(request.url)) {
      return next.handle(request);
    }
    
    const token = this.authService.getAccessToken();
    
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRequest(url: string): boolean {
    return (
      url.includes('/auth/login') || 
      url.includes('/auth/forgot-password') || 
      url.includes('/auth/refresh')
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.isRefreshing = true;
    
    return from(this.authService.refreshAccessToken()).pipe(
      switchMap(token => {
        this.isRefreshing = false;
        return next.handle(this.addToken(request, token));
      }),
      catchError(error => {
        this.isRefreshing = false;
        // If refresh token fails, redirect to login
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}