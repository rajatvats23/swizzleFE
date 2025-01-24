import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  template: `
    <nav class="bottom-nav">
      @for (item of navItems(); track item.route) {
        <a 
          [routerLink]="item.route"
          routerLinkActive="active"
          class="bottom-nav-item"
        >
          <mat-icon>{{item.icon}}</mat-icon>
          <span class="nav-label">{{item.label}}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: white;
      box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
      padding: 8px 0;
    }
    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: rgba(0,0,0,0.6);
    }
    .bottom-nav-item.active {
      color: primary;
    }
    .nav-label {
      font-size: 0.75rem;
      margin-top: 4px;
    }
  `]
})
export class BottomNavComponent {
  navItems = signal([
    { label: 'Home', icon: 'home', route: '/dashboard' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Notify', icon: 'notifications', route: '/notifications' }
  ]);
}