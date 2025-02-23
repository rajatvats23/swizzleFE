import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
        <div class="p-6">
            <h2 mat-dialog-title class="text-2xl font-bold mb-6">Welcome!</h2>
            <div mat-dialog-content>
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                    <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" formControlName="email" placeholder="Enter your email">
                        <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                            Email is required
                        </mat-error>
                        <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                            Please enter a valid email
                        </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Password</mat-label>
                        <input matInput [type]="showPassword ? 'text' : 'password'" 
                               formControlName="password">
                        <button mat-icon-button matSuffix (click)="showPassword = !showPassword">
                            <mat-icon>{{showPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                        </button>
                    </mat-form-field>

                    <div class="text-right">
                        <button type="button" 
                                mat-button 
                                color="warn">
                            Forgot Password?
                        </button>
                    </div>

                    <button mat-raised-button 
                            color="primary"
                            type="submit"
                            [disabled]="loginForm.invalid || loading">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    `
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private dialogRef: MatDialogRef<LoginComponent>,
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.invalid) return;

        this.loading = true;
        try {
            await this.authService.login(
                this.loginForm.value.email,
                this.loginForm.value.password
            );
            this.dialogRef.close(true);
        } catch (error) {
            // Handle error using MatSnackBar
        } finally {
            this.loading = false;
        }
    }

    // openForgotPassword(): void {
    //     this.dialogRef.close();
    //     this.authDialogService.openAuthDialog('forgot-password');
    // }
}
