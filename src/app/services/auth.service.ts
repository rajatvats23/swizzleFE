import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface TokenPayload {
  exp: number;
  user_id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _accessToken = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);
  
  public isAuthenticated = computed(() => {
    const token = this._accessToken();
    if (!token) return false;
    return !this.isTokenExpired();
  });
  
  private http = inject(HttpService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  constructor() {
    // Initialize tokens from localStorage
    this.initializeFromStorage();
  }
  
  private initializeFromStorage() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken) {
      this._accessToken.set(accessToken);
    }
    
    if (refreshToken) {
      this._refreshToken.set(refreshToken);
    }
    
    // Check token validity
    if (accessToken && this.isTokenExpired()) {
      // If token is expired and we can't refresh, clear tokens
      if (!refreshToken) {
        this.clearTokens();
      }
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>('/auth/login', { 
        email, 
        password 
      }).toPromise();
      
      if (response?.access_token && response?.refresh_token) {
        this.setTokens(response.access_token, response.refresh_token);
        
        // Get return url from route parameters or default to '/'
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.http.post('/auth/forgot-password', { email }).toPromise();
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw new Error('Failed to send reset email. Please try again later.');
    }
  }

  async resetPassword(password: string, token: string): Promise<void> {
    try {
      await this.http.post('/auth/reset-password', { password, token }).toPromise();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw new Error('Failed to reset password. Please try again.');
    }
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/auth/login']);
  }
  
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }

  isTokenExpired(): boolean {
    const token = this._accessToken();
    if (!token) return true;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      // Add a small buffer (30 seconds) to account for clock skew
      return (decoded.exp * 1000) < (Date.now() - 30000);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  getUserInfo(): TokenPayload | null {
    const token = this._accessToken();
    if (!token) return null;
    
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this._refreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await this.http.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken
      }).toPromise();
      
      if (response?.access_token && response?.refresh_token) {
        this.setTokens(response.access_token, response.refresh_token);
        return response.access_token;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      this.router.navigate(['/auth/login']);
      throw new Error('Session expired. Please login again.');
    }
  }
}