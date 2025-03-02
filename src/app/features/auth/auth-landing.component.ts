// src/app/features/auth/auth-landing.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-landing',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-container">
      <div class="auth-background"></div>
      <div class="auth-content">
        <div class="auth-card">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      overflow: hidden;
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('./public/assets/images/auth-bg.svg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: -1;
    }

    .auth-content {
      width: 100%;
      max-width: 450px;
      padding: 2rem;
      margin-right: 5%;
      z-index: 1;
    }

    .auth-card {
      width: auto;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .auth-container {
        justify-content: center;
      }
      
      .auth-content {
        margin-right: 0;
        padding: 1rem;
      }
      
      .auth-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class AuthLandingComponent {}