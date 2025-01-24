import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      @for (item of navItems(); track item.route) {
        <mat-list-item 
          [routerLink]="item.route" 
          routerLinkActive="active"
        >
          <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
          {{item.label}}
        </mat-list-item>
      }
    </mat-nav-list>
  `,
  styles: [`
    .active {
      background-color: rgba(0,0,0,0.1);
      color: primary;
    }
  `]
})
export class SidenavComponent {
  navItems = signal<NavItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Notifications', icon: 'notifications', route: '/notifications' }
  ]);
}