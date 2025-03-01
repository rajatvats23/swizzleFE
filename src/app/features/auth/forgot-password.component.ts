// forgot-password.component.ts
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
  selector: 'app-forgot-password',
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
    <div class="auth-form-container">
      @if (!emailSent()) {
        <div class="auth-header">
          <h1 class="auth-title">Forgot Password</h1>
          <p class="auth-subtitle">Enter the email address associated with your account</p>
        </div>
    
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-field">
            <input 
              type="email"
              class="auth-input" 
              formControlName="email" 
              placeholder="Enter Your Email">
            @if (emailControl.invalid && (emailControl.dirty || emailControl.touched)) {
              <div class="error-message">
                @if (emailControl.hasError('required')) {
                  Email is required
                } @else if (emailControl.hasError('email')) {
                  Please enter a valid email address
                }
              </div>
            }
          </div>
          
          <button 
            type="submit" 
            class="auth-button"
            [disabled]="forgotPasswordForm.invalid || submitting()">
            @if (submitting()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
            }
            {{ submitting() ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>
    
        <div class="auth-footer">
          <a class="back-link" (click)="backToLogin()">Back to Login</a>
        </div>
      } @else {
        <div class="email-sent-container">
          <div class="auth-header">
            <h1 class="auth-title">Check your Email</h1>
            <p class="auth-subtitle">We have sent a Password link to<br>{{ sentEmail() }}</p>
          </div>
          
          <button 
            class="auth-button" 
            (click)="backToLogin()">
            Back to Login
          </button>
          
          <div class="resend-link">
            Didn't receive the email? <a (click)="resendEmail()">Click to resend</a>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './forgot-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  
  submitting = signal(false);
  emailSent = signal(false);
  sentEmail = signal<string | null>(null);
  
  get emailControl() { return this.forgotPasswordForm.get('email')!; }
  
  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) return;
    
    this.submitting.set(true);
    
    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.forgotPassword(email);
      this.sentEmail.set(email);
      this.emailSent.set(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } finally {
      this.submitting.set(false);
    }
  }
  
  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  
  resendEmail(): void {
    if (this.sentEmail()) {
      this.forgotPasswordForm.setValue({ email: this.sentEmail()! });
      this.onSubmit();
    }
  }
}