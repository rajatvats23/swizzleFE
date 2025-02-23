import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    template: `
      <div class="flex min-h-screen items-center justify-center">
        <div class="w-full max-w-md p-6 rounded-lg">
          <h1 class="text-2xl font-bold mb-2">Set New Password</h1>
          <p class="mb-6">Type Your New Password here</p>
          
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="New Password"
                class="w-full p-3 rounded border"
              />
            </div>
            
            <div>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Confirm Password"
                class="w-full p-3 rounded border"
              />
            </div>
            
            <button
              type="submit"
              [disabled]="resetForm.invalid || loading"
              class="w-full p-3 bg-green-500 text-white rounded"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    `
  })
  export class ResetPasswordComponent {
    resetForm: FormGroup;
    loading = false;
    showPassword = false;
  
    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private route: ActivatedRoute
    ) {
      this.resetForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, {
        validators: this.passwordMatchValidator
      });
    }
  
    private passwordMatchValidator(g: FormGroup) {
      return g.get('password')?.value === g.get('confirmPassword')?.value
        ? null
        : { mismatch: true };
    }
  
    async onSubmit(): Promise<void> {
      if (this.resetForm.invalid) return;
  
      this.loading = true;
      try {
        const token = this.route.snapshot.queryParams['token'];
        await this.authService.resetPassword(this.resetForm.value.password, token);
        // Show success message
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    }
  }