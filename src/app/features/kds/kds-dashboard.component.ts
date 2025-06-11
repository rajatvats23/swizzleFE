import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { KitchenDisplayService } from './kds.service';
import { Order } from './models/kds.model';
import { Subscription } from 'rxjs';
import { KdsOrderCardComponent } from './kds-order-card.component';
import { KdsNotificationService } from './kds-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { KdsOrderDetailDialogComponent } from './kds-order-detail-dialog.component';
import { KdsNotificationOverlayComponent } from './kds-notification-overlay.component';

@Component({
  selector: 'app-kds-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    KdsOrderCardComponent,
    KdsNotificationOverlayComponent
  ],
  template: `
    <div class="kds-container">
      <!-- Main Header -->
      <div class="kds-header">
        <div class="kitchen-title">
          <div class="kitchen-logo">
            <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
          </div>
          <h1>Kitchen Display System</h1>
        </div>
        
        <div class="header-actions">
          <div class="search-box">
            <mat-icon class="search-icon material-symbols-outlined">search</mat-icon>
            <input type="text" placeholder="Search orders, tables or items..." 
                   [(ngModel)]="searchText" (input)="applyFilters()">
          </div>
          
          <mat-form-field appearance="outline" class="sort-select">
            <mat-label>Sort By</mat-label>
            <mat-select [(ngModel)]="sortBy" (selectionChange)="applyFilters()">
              <mat-option value="time">Time (Oldest First)</mat-option>
              <mat-option value="time-desc">Time (Newest First)</mat-option>
              <mat-option value="table">Table Number</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" class="refresh-button" (click)="refreshOrders()">
            <mat-icon class="material-symbols-outlined">refresh</mat-icon> Refresh
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="kitchen-stats">
        <div class="stat-card">
          <div class="stat-title">Active Orders</div>
          <div class="stat-value">
            <div class="stat-icon">
              <mat-icon class="material-symbols-outlined">receipt_long</mat-icon>
            </div>
            <span>{{orders.length}}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">New Orders</div>
          <div class="stat-value">
            <div class="stat-icon placed">
              <mat-icon class="material-symbols-outlined">new_releases</mat-icon>
            </div>
            <span>{{getOrdersByStatus('placed').length}}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Preparing</div>
          <div class="stat-value">
            <div class="stat-icon preparing">
              <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
            </div>
            <span>{{getOrdersByStatus('preparing').length}}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Ready</div>
          <div class="stat-value">
            <div class="stat-icon ready">
              <mat-icon class="material-symbols-outlined">check_circle</mat-icon>
            </div>
            <span>{{getOrdersByStatus('ready').length}}</span>
          </div>
        </div>
      </div>

      <!-- Orders Tabs -->
      <div class="orders-tab-container">
        <mat-tab-group mat-stretch-tabs="false" class="order-tabs" animationDuration="200ms">
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                All Orders
                <div class="badge">{{filteredOrders.length}}</div>
              </div>
            </ng-template>

            <div class="orders-grid">
              <ng-container *ngIf="filteredOrders.length > 0; else noOrders">
                <ng-container
                *ngFor="let order of filteredOrders; trackBy: trackById">
                <app-kds-order-card
                  [order]="order"
                  (statusChanged)="refreshOrders()"
                  (click)="viewOrderDetails(order._id)"
                  class="order-item"
                ></app-kds-order-card>
                </ng-container>
              </ng-container>
              
              <ng-template #noOrders>
                <div class="no-orders">
                  <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
                  <p>No active orders at the moment</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                Placed
                <div class="badge urgent">{{getOrdersByStatus('placed').length}}</div>
              </div>
            </ng-template>
            
            <div class="orders-grid">
              <ng-container *ngIf="getOrdersByStatus('placed').length > 0; else noPlacedOrders">
                <app-kds-order-card
                  *ngFor="let order of getOrdersByStatus('placed'); trackBy: trackById"
                  [order]="order"
                  (statusChanged)="refreshOrders()"
                  (click)="viewOrderDetails(order._id)"
                  class="order-item"
                ></app-kds-order-card>
              </ng-container>
              
              <ng-template #noPlacedOrders>
                <div class="no-orders">
                  <mat-icon class="material-symbols-outlined">check_circle</mat-icon>
                  <p>No new orders waiting to be prepared</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                Preparing
                <div class="badge warning">{{getOrdersByStatus('preparing').length}}</div>
              </div>
            </ng-template>
            
            <div class="orders-grid">
              <ng-container *ngIf="getOrdersByStatus('preparing').length > 0; else noPreparingOrders">
                <app-kds-order-card
                  *ngFor="let order of getOrdersByStatus('preparing'); trackBy: trackById"
                  [order]="order"
                  (statusChanged)="refreshOrders()"
                  (click)="viewOrderDetails(order._id)"
                  class="order-item"
                ></app-kds-order-card>
              </ng-container>
              
              <ng-template #noPreparingOrders>
                <div class="no-orders">
                  <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
                  <p>No orders currently being prepared</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                Ready
                <div class="badge success">{{getOrdersByStatus('ready').length}}</div>
              </div>
            </ng-template>
            
            <div class="orders-grid">
              <ng-container *ngIf="getOrdersByStatus('ready').length > 0; else noReadyOrders">
                <app-kds-order-card
                  *ngFor="let order of getOrdersByStatus('ready'); trackBy: trackById"
                  [order]="order"
                  (statusChanged)="refreshOrders()"
                  (click)="viewOrderDetails(order._id)"
                  class="order-item"
                ></app-kds-order-card>
              </ng-container>
              
              <ng-template #noReadyOrders>
                <div class="no-orders">
                  <mat-icon class="material-symbols-outlined">local_shipping</mat-icon>
                  <p>No orders ready for delivery</p>
                </div>
              </ng-template>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
      
      <app-kds-notification-overlay></app-kds-notification-overlay>
    </div>
  `,
  styles: [`
    /* Color Variables */
    :host {
      --primary-color: #009c4c;
      --primary-light: #00b359;
      --primary-dark: #00783a;
      --accent-color: #ff7979;
      --background-color: #fff8eb;
      --card-bg: #ffffff;
      --text-color: #333333;
      --text-light: #666666;
      --urgent-color: #e74c3c;
      --warning-color: #f39c12;
      --success-color: #27ae60;
      --timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Main Container */
    .kds-container {
      width: 100%;
      max-width: 1800px;
      margin: 0 auto;
      padding: 24px;
      background-color: var(--background-color);
      min-height: 100vh;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fff8eb"/><circle cx="10" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="10" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="10" cy="90" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="90" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="90" r="2" fill="%23009c4c" opacity="0.2"/></svg>');
      background-attachment: fixed;
    }
    
    /* Header Styles */
    .kds-header {
      background-color: var(--card-bg);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideDown 0.5s var(--timing-function);
    }
    
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .kitchen-title {
      display: flex;
      align-items: center;
    }
    
    .kitchen-title h1 {
      color: var(--text-color);
      margin: 0;
      font-weight: 700;
      position: relative;
    }
    
    .kitchen-title h1::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      border-radius: 10px;
      transition: width 0.3s ease;
    }
    
    .kitchen-title h1:hover::after {
      width: 100%;
    }
    
    .kitchen-logo {
      width: 48px;
      height: 48px;
      background-color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      box-shadow: 0 5px 15px rgba(0, 156, 76, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    .kitchen-logo::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      top: 0;
      left: -100%;
      animation: shimmer 3s infinite linear;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(0%) rotate(0deg); }
      100% { transform: translateX(200%) rotate(0deg); }
    }
    
    .kitchen-logo mat-icon {
      color: white;
      font-size: 28px;
      height: 28px;
      width: 28px;
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    .sort-select {
      width: 200px;
      margin-bottom: -1.25em;
    }
    
    .refresh-button {
      height: 42px;
      background-color: var(--primary-color);
      transition: all 0.3s ease;
    }
    
    .refresh-button:hover {
      background-color: var(--primary-dark);
      box-shadow: 0 5px 15px rgba(0, 156, 76, 0.3);
      transform: translateY(-2px);
    }
    
    /* Search Box */
    .search-box {
      position: relative;
      width: 300px;
    }
    
    .search-box input {
      width: 100%;
      height: 42px;
      padding: 0 16px 0 42px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    
    .search-box input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 5px 15px rgba(0, 156, 76, 0.1);
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9e9e9e;
    }
    
    /* Stats Row */
    .kitchen-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 24px;
      animation: fadeIn 0.8s ease-out 0.2s backwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .stat-card {
      background-color: var(--card-bg);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      background: linear-gradient(to bottom, var(--primary-color), var(--primary-light));
      border-radius: 5px 0 0 5px;
      transition: width 0.3s ease;
    }
    
    .stat-card:hover::before {
      width: 7px;
    }
    
    .stat-title {
      font-size: 16px;
      color: var(--text-light);
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-color);
      display: flex;
      align-items: center;
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      background-color: rgba(0, 156, 76, 0.1);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover .stat-icon {
      background-color: var(--primary-color);
    }
    
    .stat-card:hover .stat-icon mat-icon {
      color: white;
    }
    
    .stat-icon mat-icon {
      font-size: 28px;
      height: 28px;
      width: 28px;
      color: var(--primary-color);
      transition: all 0.3s ease;
    }
    
    .stat-icon.placed {
      background-color: rgba(231, 76, 60, 0.1);
    }
    
    .stat-icon.placed mat-icon {
      color: var(--urgent-color);
    }
    
    .stat-card:hover .stat-icon.placed {
      background-color: var(--urgent-color);
    }
    
    .stat-icon.preparing {
      background-color: rgba(243, 156, 18, 0.1);
    }
    
    .stat-icon.preparing mat-icon {
      color: var(--warning-color);
    }
    
    .stat-card:hover .stat-icon.preparing {
      background-color: var(--warning-color);
    }
    
    .stat-icon.ready {
      background-color: rgba(39, 174, 96, 0.1);
    }
    
    .stat-icon.ready mat-icon {
      color: var(--success-color);
    }
    
    .stat-card:hover .stat-icon.ready {
      background-color: var(--success-color);
    }
    
    /* Orders Tab Container */
    .orders-tab-container {
      background-color: var(--card-bg);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      animation: fadeIn 0.8s ease-out 0.4s backwards;
    }
    
    .order-tabs {
      min-height: 500px;
    }
    
    ::ng-deep .mat-mdc-tab-header {
      border-bottom: 1px solid #eee;
    }
    
    .tab-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background-color: #5c6bc0;
      color: white;
      font-size: 12px;
      font-weight: 500;
    }
    
    .badge.urgent {
      background-color: var(--urgent-color);
    }
    
    .badge.warning {
      background-color: var(--warning-color);
    }
    
    .badge.success {
      background-color: var(--success-color);
    }
    
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
      padding: 24px;
      min-height: 400px;
    }
    
    .order-item {
      cursor: pointer;
      transition: transform 0.3s var(--timing-function), box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
      }
    }
    
    .no-orders {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      color: #9e9e9e;
      
      mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        margin-bottom: 24px;
        opacity: 0.5;
      }
      
      p {
        font-size: 18px;
        margin: 0;
      }
    }
    
    /* Responsive Styles */
    @media (max-width: 1200px) {
      .kitchen-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 900px) {
      .kds-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }
      
      .header-actions {
        width: 100%;
        flex-wrap: wrap;
      }
      
      .search-box {
        width: 100%;
      }
    }
    
    @media (max-width: 768px) {
      .kitchen-stats {
        grid-template-columns: 1fr;
      }
      
      .orders-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class KdsDashboardComponent implements OnInit, OnDestroy {
  private kdsService = inject(KitchenDisplayService);
  private snackBar = inject(MatSnackBar);
  private notificationService = inject(KdsNotificationService);
  private dialog = inject(MatDialog);
  private lastOrderCount = 0;

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  sortBy: 'time' | 'time-desc' | 'table' = 'time';
  searchText = '';

  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.kdsService.activeOrders$.subscribe((orders) => {
        // Check for new orders
        if (this.lastOrderCount > 0 && orders.length > this.lastOrderCount) {
          // Find new orders (those not in the previous set)
          const previousOrders = this.orders;
          const newOrders = orders.filter(
            (order) =>
              !previousOrders.some(
                (prevOrder) => prevOrder._id === order._id
              ) && order.status === 'placed'
          );

          // Add notifications for new orders
          newOrders.forEach((order) => {
            this.notificationService.addNotification(order);
          });
        }

        this.lastOrderCount = orders.length;
        this.orders = orders;
        this.applyFilters();
      })
    );

    // Start polling for updates
    this.kdsService.startPolling();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.kdsService.stopPolling();
  }

  refreshOrders(): void {
    this.kdsService.refreshOrders();
    this.snackBar.open('Orders refreshed', 'Close', { 
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  viewOrderDetails(orderId: string): void {
    this.dialog
      .open(KdsOrderDetailDialogComponent, {
        data: { orderId },
        width: '800px',
        panelClass: 'order-detail-dialog'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.refreshOrders();
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.orders];
    
    // Apply search filter if there's a search term
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(order => 
        // Search by order ID
        order._id.toLowerCase().includes(searchLower) ||
        // Search by table number
        order.table.tableNumber.toLowerCase().includes(searchLower) ||
        // Search by order item names
        order.items.some(item => item.product.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'time':
        filtered = filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'time-desc':
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'table':
        filtered = filtered.sort((a, b) =>
          a.table.tableNumber.localeCompare(b.table.tableNumber)
        );
        break;
    }

    this.filteredOrders = filtered;
  }

  getOrdersByStatus(status: string): Order[] {
    return this.filteredOrders.filter((order) => order.status === status);
  }

  trackById(index: number, order: Order): string {
    return order._id;
  }
}