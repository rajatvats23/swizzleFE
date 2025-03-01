// reset-password.component.ts
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators,
  AbstractControl,
  ValidationErrors 
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="auth-form-container">
      @if (invalidToken()) {
        <div class="invalid-token">
          <h1 class="auth-title">Invalid Reset Link</h1>
          <p class="auth-subtitle">The password reset link is invalid or has expired.</p>
          <button 
            class="auth-button" 
            (click)="backToLogin()">
            Back to Login
          </button>
        </div>
      } @else {
        <div class="auth-header">
          <h1 class="auth-title">Set New Password</h1>
          <p class="auth-subtitle">Type Your New Password here</p>
        </div>
    
        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-field">
            <div class="password-input-container">
              <input 
                [type]="hidePassword() ? 'password' : 'text'"
                class="auth-input" 
                formControlName="password" 
                placeholder="New Password">
            </div>
            @if (passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) {
              <div class="error-message">
                @if (passwordControl.hasError('required')) {
                  Password is required
                } @else if (passwordControl.hasError('minlength')) {
                  Password must be at least 8 characters
                } @else if (passwordControl.hasError('pattern')) {
                  Password must include at least one uppercase letter, one lowercase letter, and one number
                }
              </div>
            }
          </div>
          
          <div class="form-field">
            <div class="password-input-container">
              <input 
                [type]="hideConfirmPassword() ? 'password' : 'text'"
                class="auth-input" 
                formControlName="confirmPassword" 
                placeholder="Confirm Password">
              <button 
                type="button"
                class="visibility-toggle" 
                (click)="toggleConfirmPasswordVisibility()">
                <mat-icon>{{hideConfirmPassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </div>
            @if (confirmPasswordControl.invalid && (confirmPasswordControl.dirty || confirmPasswordControl.touched)) {
              <div class="error-message">
                @if (confirmPasswordControl.hasError('required')) {
                  Confirm password is required
                } @else if (confirmPasswordControl.hasError('minlength')) {
                  Password must be at least 8 characters
                }
              </div>
            }
            @if (resetPasswordForm.hasError('passwordMismatch') && confirmPasswordControl.touched) {
              <div class="error-message">
                Passwords do not match
              </div>
            }
          </div>
          
          <button 
            type="submit" 
            class="auth-button"
            [disabled]="resetPasswordForm.invalid || submitting()">
            @if (submitting()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
            }
            {{ submitting() ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      }
    </div>
  `,
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  
  resetPasswordForm: FormGroup = this.fb.group({
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
    ]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, { validators: this.passwordMatchValidator });
  
  submitting = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  token = signal<string | null>(null);
  invalidToken = signal(false);
  
  get passwordControl() { return this.resetPasswordForm.get('password')!; }
  get confirmPasswordControl() { return this.resetPasswordForm.get('confirmPassword')!; }
  
  ngOnInit(): void {
    // Extract token from route params
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token.set(params['token']);
      } else {
        this.invalidToken.set(true);
        this.snackBar.open('Invalid or missing reset token', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
  
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && 
        password.value !== confirmPassword.value && 
        !confirmPassword.hasError('required')) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }
  
  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) return;
    
    this.submitting.set(true);
    
    try {
      const { password } = this.resetPasswordForm.value;
      
      if (!this.token()) {
        throw new Error('Missing reset token');
      }
      
      await this.authService.resetPassword(password, this.token()!);
      this.snackBar.open('Password reset successfully', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/auth/login']);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
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
}