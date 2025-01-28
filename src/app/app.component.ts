import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatSidenavModule, RouterModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  destroyed = new Subject<void>();
  isHandset = signal(false);
  navItems = signal<NavItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Notifications', icon: 'notifications', route: '/notifications' }
  ]);

  constructor() {
    inject(BreakpointObserver)
      .observe([Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        this.isHandset.set(result.matches);
        this.drawer.toggle();
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}