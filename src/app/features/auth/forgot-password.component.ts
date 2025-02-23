import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
      <div class="flex min-h-screen items-center justify-center">
        <div class="w-full max-w-md p-6 rounded-lg">
          <h1 class="text-2xl font-bold mb-2">Forgot Password</h1>
          <p class="mb-6">Enter the email address associated with your account</p>
          
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <input
                type="email"
                formControlName="email"
                placeholder="Enter Your Email"
                class="w-full p-3 rounded border"
              />
            </div>
            
            <button
              type="submit"
              [disabled]="forgotForm.invalid || loading"
              class="w-full p-3 bg-green-500 text-white rounded"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    `
  })
  export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    loading = false;
  
    constructor(
      private fb: FormBuilder,
      private authService: AuthService
    ) {
      this.forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }
  
    async onSubmit(): Promise<void> {
      if (this.forgotForm.invalid) return;
  
      this.loading = true;
      try {
        await this.authService.forgotPassword(this.forgotForm.value.email);
        // Show success message
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    }
  }