// src/app/features/auth/auth.components.ts
import { Component, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthBaseComponent } from './auth-base.component';

// Import shared styles';

// LOGIN COMPONENT
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
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="title primary">Welcome!</h1>
        <p class="subtitle">Sign in to Get Started</p>
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
        
        <div class="auth-actions">
          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="auth-button"
            [disabled]="loginForm.invalid || submitting()">
            <span class="row-text">
            @if (submitting()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
            }
            {{ submitting() ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </div>
      </form>
  
      <div class="auth-footer right-aligned">
        <a class="link accent" (click)="navigateToForgotPassword()">Forgot Password</a>
      </div>
    </div>
  `,
  styleUrls: ['./auth.styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends AuthBaseComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  get emailControl() { return this.loginForm.get('email')!; }
  get passwordControl() { return this.loginForm.get('password')!; }
  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    
    this.submitting.set(true);
    
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email!, password!);
      // Navigation is handled in the auth service
    } catch (error) {
      this.handleError(error, 'Login failed');
    } finally {
      this.submitting.set(false);
    }
  }
}

// FORGOT PASSWORD COMPONENT
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
    MatIconModule,
  ],
  template: `
    <div class="auth-container">
      @if (!emailSent()) {
      <div class="auth-header">
        <h1 class="title accent">Forgot Password</h1>
        <p class="subtitle">
          Enter the email address associated with your account
        </p>
      </div>

      <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
        <div class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input
              matInput
              formControlName="email"
              placeholder="name@example.com"
              type="email"
            />
            @if (emailControl.invalid && (emailControl.dirty ||
            emailControl.touched)) {
            <mat-error>
              @if (emailControl.hasError('required')) { Email is required }
              @else if (emailControl.hasError('email')) { Please enter a valid
              email address }
            </mat-error>
            }
          </mat-form-field>
        </div>

        <div class="auth-actions">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="auth-button"
            [disabled]="forgotPasswordForm.invalid || submitting()"
          >
            <span class="row-text">
              @if (submitting()) {
              <mat-spinner diameter="20" class="spinner"></mat-spinner>
              }
              {{ submitting() ? "Sending..." : "Reset Password" }}
            </span>
          </button>
        </div>
      </form>

      <div class="auth-footer">
        <a class="link" (click)="navigateToLogin()">Back to Login</a>
      </div>
      } @else {
      <div class="email-sent-container">
        <div class="auth-header">
          <h1 class="title accent">Check your Email</h1>
          <p class="subtitle">
            We have sent a password reset link to<br />{{ sentEmail() }}
          </p>
        </div>

        <div class="auth-actions">
          <button
            mat-raised-button
            color="primary"
            class="auth-button"
            (click)="navigateToLogin()"
          >
            Back to Login
          </button>
        </div>

        <div class="resend-link">
          Didn't receive the email?
          <a (click)="resendEmail()">Click to resend</a>
        </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./auth.styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends AuthBaseComponent {
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  emailSent = signal(false);
  sentEmail = signal<string | null>(null);

  get emailControl() {
    return this.forgotPasswordForm.get('email')!;
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) return;

    this.submitting.set(true);

    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.forgotPassword(email!);
      this.sentEmail.set(email!);
      this.emailSent.set(true);
    } catch (error) {
      this.handleError(error, 'Failed to send reset email');
    } finally {
      this.submitting.set(false);
    }
  }

  resendEmail(): void {
    if (this.sentEmail()) {
      this.forgotPasswordForm.setValue({ email: this.sentEmail()! });
      this.onSubmit();
    }
  }
}

// RESET PASSWORD COMPONENT
@Component({
  selector: 'app-reset-password',
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
    <div class="auth-container">
      @if (invalidToken()) {
        <div class="email-sent-container">
          <div class="auth-header">
            <h1 class="title error">Invalid Reset Link</h1>
            <p class="subtitle">The password reset link is invalid or has expired.</p>
          </div>
          <div class="auth-actions">
            <button 
              mat-raised-button 
              color="primary" 
              class="auth-button" 
              (click)="navigateToLogin()">
              Back to Login
            </button>
          </div>
        </div>
      } @else {
        <div class="auth-header">
          <h1 class="title primary">Set New Password</h1>
          <p class="subtitle">Type your new password below</p>
        </div>
    
        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
          <div class="form-fields">
            <mat-form-field appearance="outline">
              <mat-label>New Password</mat-label>
              <input matInput 
                     formControlName="password" 
                     [type]="hidePassword() ? 'password' : 'text'" 
                     placeholder="Enter your new password">
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
                    Password must be at least 8 characters
                  } @else if (passwordControl.hasError('pattern')) {
                    Password must include at least one uppercase letter, one lowercase letter, and one number
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput 
                     formControlName="confirmPassword" 
                     [type]="hideConfirmPassword() ? 'password' : 'text'" 
                     placeholder="Confirm your new password">
              <button type="button" 
                      mat-icon-button 
                      matSuffix 
                      (click)="toggleConfirmPasswordVisibility()" 
                      [attr.aria-label]="'Hide password'" 
                      [attr.aria-pressed]="hideConfirmPassword()">
                <mat-icon>{{hideConfirmPassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (confirmPasswordControl.invalid && (confirmPasswordControl.dirty || confirmPasswordControl.touched)) {
                <mat-error>
                  @if (confirmPasswordControl.hasError('required')) {
                    Confirm password is required
                  } @else if (confirmPasswordControl.hasError('minlength')) {
                    Password must be at least 8 characters
                  }
                </mat-error>
              }
              @if (resetPasswordForm.hasError('passwordMismatch') && confirmPasswordControl.touched) {
                <mat-error>
                  Passwords do not match
                </mat-error>
              }
            </mat-form-field>
          </div>
          
          <div class="auth-actions">
            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="auth-button"
              [disabled]="resetPasswordForm.invalid || submitting()">
              <span class="row-text">
                @if (submitting()) {
                  <mat-spinner diameter="20" class="spinner"></mat-spinner>
                }
                {{ submitting() ? 'Resetting...' : 'Reset Password' }}
              </span>
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styleUrls: ['./auth.styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent extends AuthBaseComponent implements OnInit {
  resetPasswordForm = this.fb.group({
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(this.strongPasswordPattern)
    ]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, { validators: this.passwordMatchValidator });
  
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
  
  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) return;
    
    this.submitting.set(true);
    
    try {
      const { password } = this.resetPasswordForm.value;
      
      if (!this.token()) {
        throw new Error('Missing reset token');
      }
      
      await this.authService.resetPassword(password!, this.token()!);
      this.snackBar.open('Password reset successfully', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.navigateToLogin();
    } catch (error) {
      this.handleError(error, 'Failed to reset password');
    } finally {
      this.submitting.set(false);
    }
  }
}