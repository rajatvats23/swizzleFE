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
import { navigationConfig, NavItem } from '../config/navigation.config';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    MatSidenavModule, 
    RouterModule, 
    MatListModule, 
    MatIconModule, 
    MatToolbarModule, 
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  
  destroyed = new Subject<void>();
  isHandset = signal(false);
  navItems = signal<NavItem[]>(navigationConfig.items);
  appTitle = navigationConfig.appTitle;
  
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

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}