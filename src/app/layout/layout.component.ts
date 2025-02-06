import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { navigationConfig, NavItem } from '../config/navigation.config';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SharedModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  logo: string = '/assets/images/logo.svg';
  destroyed = new Subject<void>();
  showSidenavToggle = signal(true);
  left: string = '73px';
  isHandset = signal(false);
  navItems = signal<NavItem[]>(navigationConfig.items);
  appTitle = navigationConfig.appTitle;
  isExpanded = signal(true);
  authService = inject(AuthService);
  
  constructor() {
    inject(BreakpointObserver)
      .observe([Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        this.isHandset.set(result.matches);
        if (this.drawer) {
          this.drawer.toggle();
        }
      });
  }

  async toggleSidenavView() {
    if (this.drawer) {
      this.showSidenavToggle.set(false);
      await this.drawer.close().then(() => {
        this.isExpanded.set(!this.isExpanded());
        this.drawer.open().then(() => {
          this.showSidenavToggle.set(true);
        })
        
      })
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}