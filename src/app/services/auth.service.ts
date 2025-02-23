
import { Injectable, signal, computed } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  private _accessToken = signal<string | null>(localStorage.getItem('access_token'));
  private _refreshToken = signal<string | null>(localStorage.getItem('refresh_token'));
  
  public isAuthenticated = computed(() => !!this._accessToken());
  
  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>('/auth/login', { 
        email, 
        password 
      }).toPromise();
      
      this.setTokens(response!.access_token, response!.refresh_token);
      
      // Get return url from route parameters or default to '/'
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.http.post('/auth/forgot-password', { email }).toPromise();
    } catch (error) {
      throw new Error('Failed to send reset email');
    }
  }

  async resetPassword(password: string, token: string): Promise<void> {
    try {
      await this.http.post('/auth/reset-password', { password, token }).toPromise();
      this.router.navigate(['/login']);
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    const token = this._accessToken();
    if (!token) return true;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getUserInfo(): TokenPayload | null {
    const token = this._accessToken();
    if (!token) return null;
    
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
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
      const response = await this.http.post<AuthResponse>('/auth/refresh', {
        refresh_token: this._refreshToken()
      }).toPromise();
      
      this.setTokens(response!.access_token, response!.refresh_token);
      return response!.access_token;
    } catch {
      this.logout();
      throw new Error('Session expired');
    }
  }
}