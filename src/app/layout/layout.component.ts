import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { navigationConfig, NavItem } from '../config/navigation.config';
import { SharedModule } from '../shared/shared.module';

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
  logo: string = 'assets/images/logo.svg';
  destroyed = new Subject<void>();
  isHandset = signal(false);
  navItems = signal<NavItem[]>(navigationConfig.items);
  appTitle = navigationConfig.appTitle;
  isExpanded = signal(true);
  
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
      await this.drawer.close();
      setTimeout(() => {
        this.isExpanded.set(!this.isExpanded());
        this.drawer.open();
      }, 200);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}