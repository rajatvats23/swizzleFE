import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { BottomNavComponent } from './layout/bottom-nav/bottom-nav.component';
import { HeaderComponent } from './layout/layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatSidenavModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidenavComponent,
    HeaderComponent,
    BottomNavComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <mat-drawer-container class="dashboard-container">
        <mat-drawer mode="side" opened class="sidenav">
          <app-sidenav></app-sidenav>
        </mat-drawer>
        <mat-drawer-content>
          <router-outlet></router-outlet>
        </mat-drawer-content>
      </mat-drawer-container>
      <app-bottom-nav class="mobile-nav"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .dashboard-container {
      flex-grow: 1;
    }
    .sidenav {
      width: 250px;
    }
    .mobile-nav {
      display: none;
    }
    @media (max-width: 600px) {
      mat-drawer-container {
        display: none;
      }
      .mobile-nav {
        display: block;
      }
    }
  `]
})
export class AppComponent {}