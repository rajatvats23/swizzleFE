// src/app/features/auth/auth-base.component.ts
import { inject, Directive, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Directive()
export abstract class AuthBaseComponent {
  protected fb = inject(FormBuilder);
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected snackBar = inject(MatSnackBar);
  
  // Common form state signals
  submitting = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  
  // Common error handling
  protected handleError(error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  
  // Navigation helpers
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  
  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
  
  // Password validation helpers
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }
  
  // Form validation
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
  
  // Strong password pattern
  protected readonly strongPasswordPattern = 
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$';
}