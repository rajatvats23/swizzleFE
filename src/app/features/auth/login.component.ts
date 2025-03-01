// login.component.ts
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <div class="header">
        <h1 class="welcome-title">Welcome!</h1>
        <p class="signin-subtitle">Sign in to Get Started</p>
      </div>
  
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Enter Your Email</mat-label>
            <input matInput 
                   formControlName="email" 
                   placeholder="name@example.com" 
                   type="email">
            @if (emailControl.invalid && (emailControl.dirty || emailControl.touched)) {
              <mat-error>
                @if (emailControl.hasError('required')) {
                  Email is required
                } @else if (emailControl.hasError('email')) {
                  Please enter a valid email address
                }
              </mat-error>
            }
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput 
                   formControlName="password" 
                   [type]="hidePassword() ? 'password' : 'text'" 
                   placeholder="Enter your password">
            <button type="button" 
                    mat-icon-button 
                    matSuffix 
                    (click)="togglePasswordVisibility()" 
                    [attr.aria-label]="'Hide password'" 
                    [attr.aria-pressed]="hidePassword()">
              <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            @if (passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) {
              <mat-error>
                @if (passwordControl.hasError('required')) {
                  Password is required
                } @else if (passwordControl.hasError('minlength')) {
                  Password must be at least 6 characters
                }
              </mat-error>
            }
          </mat-form-field>
        </div>
        
        <div class="login-actions">
          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="signin-button"
            [disabled]="loginForm.invalid || submitting()">
            <span class="row-text">
            @if (submitting()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
            }
            {{ submitting() ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </div>
      </form>
  
      <div class="footer">
        <a class="forgot-password" (click)="navigateToForgotPassword()">Forgot Password</a>
      </div>
    </div>
  `,
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  submitting = signal(false);
  hidePassword = signal(true);
  
  get emailControl() { return this.loginForm.get('email')!; }
  get passwordControl() { return this.loginForm.get('password')!; }
  
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }
  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    
    this.submitting.set(true);
    
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      // Navigation is handled in the auth service
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } finally {
      this.submitting.set(false);
    }
  }
  
  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}