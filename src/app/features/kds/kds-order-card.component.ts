import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { KitchenDisplayService } from './kds.service';
import { Order, OrderItem } from './models/kds.model';
import { KdsPrintService } from './kds-print.service';

@Component({
  selector: 'app-kds-order-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  template: `
    <div class="order-card" [ngClass]="'status-' + order.status" (click)="$event.stopPropagation()">
      <!-- Order Header -->
      <div class="order-header">
        <div class="order-number">Order #{{getOrderNumber()}}</div>
        <div class="order-time">
          <mat-icon class="material-symbols-outlined">schedule</mat-icon>
          {{getTimeSince(order.createdAt)}}
        </div>
      </div>
      
      <!-- Order Info -->
      <div class="order-info">
        <div class="order-customer">
          <div class="table-badge">
            <mat-icon class="material-symbols-outlined">table_restaurant</mat-icon>
            <span>Table {{order.table.tableNumber}}</span>
          </div>
          <div class="status-badge" [ngClass]="'status-' + order.status">
            {{getStatusLabel(order.status)}}
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar" [style.width]="getStatusProgress(order.status)"></div>
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="order-items">
        <div class="item" *ngFor="let item of order.items; trackBy: trackByItemId" 
             [ngClass]="getItemStatusClass(item.status)">
          <div class="item-header">
            <div class="item-main">
              <div class="item-quantity">{{item.quantity}}×</div>
              <div class="item-name">{{getItemName(item)}}</div>
            </div>
            
            <div class="item-actions">
              <div class="item-status-indicator" [ngClass]="'status-indicator-' + item.status">
                <mat-icon *ngIf="item.status === 'ready'" class="material-symbols-outlined">check_circle</mat-icon>
                <mat-icon *ngIf="item.status === 'preparing'" class="material-symbols-outlined">restaurant</mat-icon>
                <mat-icon *ngIf="item.status === 'ordered'" class="material-symbols-outlined">schedule</mat-icon>
                <mat-icon *ngIf="item.status === 'delivered'" class="material-symbols-outlined">done_all</mat-icon>
              </div>
              
              <button mat-icon-button class="item-menu-button" [matMenuTriggerFor]="itemMenu">
                <mat-icon class="material-symbols-outlined">more_vert</mat-icon>
              </button>
              
              <mat-menu #itemMenu="matMenu">
                <button mat-menu-item *ngIf="item.status === 'ordered'" (click)="updateItemStatus(item._id, 'preparing')">
                  <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
                  <span>Start Preparing</span>
                </button>
                <button mat-menu-item *ngIf="item.status === 'preparing'" (click)="updateItemStatus(item._id, 'ready')">
                  <mat-icon class="material-symbols-outlined">check_circle</mat-icon>
                  <span>Mark as Ready</span>
                </button>
                <button mat-menu-item *ngIf="item.status === 'ready'" (click)="updateItemStatus(item._id, 'delivered')">
                  <mat-icon class="material-symbols-outlined">room_service</mat-icon>
                  <span>Mark as Delivered</span>
                </button>
              </mat-menu>
            </div>
          </div>
          
          <!-- Item Addons and Special Instructions -->
          <div class="item-details" *ngIf="item.selectedAddons?.length || item.specialInstructions">
            <div class="addons" *ngIf="item.selectedAddons?.length">
              <div class="addon" *ngFor="let addon of item.selectedAddons">
                <span class="addon-name">{{addon.addon.name}}:</span>
                <span class="addon-value">{{addon.subAddon.name}}</span>
              </div>
            </div>
            
            <div class="special-instructions" *ngIf="item.specialInstructions">
              <mat-icon class="material-symbols-outlined warning-icon">priority_high</mat-icon>
              <span class="instruction-text">{{item.specialInstructions}}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Notes -->
      <div class="order-notes" *ngIf="order.specialInstructions">
        <div class="note-header">
          <mat-icon class="material-symbols-outlined">info</mat-icon>
          <span>Special Instructions</span>
        </div>
        <div class="note-text">{{order.specialInstructions}}</div>
      </div>
      
      <!-- Card Footer -->
      <div class="card-footer">
        <div class="timer" [ngClass]="getTimerClass(order.createdAt)">
          <span class="timer-indicator"></span>
          <span>{{getFullTimeString(order.createdAt)}} {{getWaitingTime(order.createdAt)}}</span>
        </div>
        
        <div class="footer-actions">
          <button class="action-button print-button" matTooltip="Print Order" (click)="printOrderTicket()">
            <mat-icon class="material-symbols-outlined">print</mat-icon>
          </button>
          
          <div class="action-spacer"></div>
          
          <button *ngIf="order.status === 'placed'" class="action-button primary-action" 
                  (click)="updateOrderStatus('preparing')">
            <mat-icon class="material-symbols-outlined">restaurant</mat-icon>
            <span>Start Preparing</span>
          </button>
          
          <button *ngIf="order.status === 'preparing'" class="action-button ready-action" 
                  (click)="updateOrderStatus('ready')">
            <mat-icon class="material-symbols-outlined">check_circle</mat-icon>
            <span>Mark Ready</span>
          </button>
          
          <button *ngIf="order.status === 'ready'" class="action-button deliver-action" 
                  (click)="updateOrderStatus('delivered')">
            <mat-icon class="material-symbols-outlined">room_service</mat-icon>
            <span>Deliver</span>
          </button>
          
          <button *ngIf="order.status === 'delivered'" class="action-button complete-action" 
                  (click)="updateOrderStatus('completed')">
            <mat-icon class="material-symbols-outlined">done_all</mat-icon>
            <span>Complete</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Color Variables */
    :host {
      --primary-color: #009c4c;
      --primary-light: #00b359;
      --primary-dark: #00783a;
      --accent-color: #ff7979;
      --card-bg: #ffffff;
      --text-color: #333333;
      --text-light: #666666;
      --urgent-color: #e74c3c;
      --warning-color: #f39c12;
      --success-color: #27ae60;
      --timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Order Card Base */
    .order-card {
      position: relative;
      border-radius: 16px;
      background-color: var(--card-bg);
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.3s var(--timing-function);
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
    
    /* Status-specific styling */
    .order-card.status-placed {
      border-top: 5px solid var(--urgent-color);
    }
    
    .order-card.status-preparing {
      border-top: 5px solid var(--warning-color);
    }
    
    .order-card.status-ready {
      border-top: 5px solid var(--success-color);
    }
    
    .order-card.status-delivered {
      border-top: 5px solid var(--primary-color);
    }
    
    /* Order Header */
    .order-header {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fafafa;
    }
    
    .order-number {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color);
    }
    
    .order-time {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-light);
      font-size: 14px;
      font-weight: 500;
    }
    
    .order-time mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }
    
    /* Order Info */
    .order-info {
      padding: 16px 20px;
    }
    
    .order-customer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    
    .table-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: rgba(0, 0, 0, 0.06);
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 500;
    }
    
    .table-badge mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }
    
    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      color: white;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .status-badge.status-placed {
      background-color: var(--urgent-color);
    }
    
    .status-badge.status-preparing {
      background-color: var(--warning-color);
    }
    
    .status-badge.status-ready {
      background-color: var(--success-color);
    }
    
    .status-badge.status-delivered {
      background-color: var(--primary-color);
    }
    
    /* Progress Bar */
    .progress-container {
      width: 100%;
      height: 5px;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      border-radius: 3px;
      transition: width 0.5s ease;
      position: relative;
    }
    
    .progress-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      animation: progress-animation 2s infinite linear;
    }
    
    @keyframes progress-animation {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .status-placed .progress-bar {
      background: linear-gradient(90deg, var(--urgent-color), #ff6b6b);
    }
    
    .status-preparing .progress-bar {
      background: linear-gradient(90deg, var(--warning-color), #ffc171);
    }
    
    .status-ready .progress-bar {
      background: linear-gradient(90deg, var(--success-color), #2ecc71);
    }
    
    /* Order Items */
    .order-items {
      padding: 16px 20px;
      flex: 1;
      overflow-y: auto;
      background-color: #f7f7f7;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .item {
      background-color: white;
      border-radius: 10px;
      padding: 14px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
      border-left: 4px solid rgba(0, 0, 0, 0.1);
    }
    
    .item.item-ordered {
      border-left-color: #bdbdbd;
    }
    
    .item.item-preparing {
      border-left-color: var(--warning-color);
    }
    
    .item.item-ready {
      border-left-color: var(--success-color);
    }
    
    .item.item-delivered {
      border-left-color: var(--primary-color);
      opacity: 0.7;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    
    .item-main {
      display: flex;
      align-items: center;
    }
    
    .item-quantity {
      font-size: 16px;
      font-weight: 700;
      margin-right: 8px;
      color: var(--text-color);
    }
    
    .item-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--text-color);
    }
    
    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .item-status-indicator {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      
      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
      }
    }
    
    .status-indicator-ordered {
      background-color: rgba(189, 189, 189, 0.2);
      color: #757575;
    }
    
    .status-indicator-preparing {
      background-color: rgba(243, 156, 18, 0.2);
      color: var(--warning-color);
    }
    
    .status-indicator-ready {
      background-color: rgba(39, 174, 96, 0.2);
      color: var(--success-color);
    }
    
    .status-indicator-delivered {
      background-color: rgba(0, 156, 76, 0.2);
      color: var(--primary-color);
    }
    
    /* Item Details */
    .item-details {
      margin-top: 8px;
    }
    
    .addons {
      margin-bottom: 8px;
    }
    
    .addon {
      font-size: 13px;
      color: var(--text-light);
      margin-bottom: 4px;
      padding-left: 10px;
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 4px;
        height: 4px;
        background-color: #bdbdbd;
        border-radius: 50%;
      }
    }
    
    .addon-name {
      font-weight: 500;
      margin-right: 4px;
    }
    
    .special-instructions {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background-color: rgba(243, 156, 18, 0.1);
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 13px;
      
      .warning-icon {
        color: var(--warning-color);
        font-size: 16px;
        height: 16px;
        width: 16px;
      }
    }
    
    /* Order Notes */
    .order-notes {
      margin: 0 20px 16px;
      background-color: rgba(52, 152, 219, 0.1);
      border-radius: 10px;
      padding: 14px;
    }
    
    .note-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #3498db;
      font-weight: 500;
      font-size: 14px;
    }
    
    .note-text {
      font-size: 13px;
      color: var(--text-color);
      line-height: 1.5;
    }
    
    /* Card Footer */
    .card-footer {
      padding: 16px 20px;
      background-color: #f5f5f5;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .timer {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: var(--text-light);
    }
    
    .timer-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .timer.on-time .timer-indicator {
      background-color: var(--success-color);
      box-shadow: 0 0 8px var(--success-color);
      animation: pulse 2s infinite;
    }
    
    .timer.warning .timer-indicator {
      background-color: var(--warning-color);
      box-shadow: 0 0 8px var(--warning-color);
      animation: pulse 1.5s infinite;
    }
    
    .timer.urgent .timer-indicator {
      background-color: var(--urgent-color);
      box-shadow: 0 0 8px var(--urgent-color);
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    .footer-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .action-button.print-button {
      color: var(--text-light);
    }
    
    .action-button.print-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--text-color);
    }
    
    .action-spacer {
      flex: 1;
    }
    
    .action-button.primary-action {
      background-color: var(--primary-color);
      color: white;
    }
    
    .action-button.primary-action:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 156, 76, 0.3);
    }
    
    .action-button.ready-action {
      background-color: var(--success-color);
      color: white;
    }
    
    .action-button.ready-action:hover {
      background-color: #219653;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
    }
    
    .action-button.deliver-action {
      background-color: #3498db;
      color: white;
    }
    
    .action-button.deliver-action:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }
    
    .action-button.complete-action {
      background-color: #9b59b6;
      color: white;
    }
    
    .action-button.complete-action:hover {
      background-color: #8e44ad;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3);
    }
    
    @media (max-width: 480px) {
      .order-customer {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .footer-actions {
        flex-wrap: wrap;
      }
      
      .action-button span {
        display: none;
      }
      
      .action-button {
        padding: 8px;
      }
    }
  `],
})
export class KdsOrderCardComponent {
  @Input() order!: Order;
  @Output() statusChanged = new EventEmitter<void>();

  private kdsService = inject(KitchenDisplayService);
  private snackBar = inject(MatSnackBar);
  private printService = inject(KdsPrintService);

  getOrderNumber(): string {
    return this.order._id.slice(-6).toUpperCase();
  }
  
  getStatusClass(): string {
    return `status-${this.order.status}`;
  }

  getItemStatusClass(status: string): string {
    return `item-${status}`;
  }

  printOrderTicket(): void {
    this.printService.printOrderTicket(this.order);
    this.snackBar.open('Order ticket sent to printer', 'Close', { duration: 3000 });
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  getStatusProgress(status: string): string {
    switch(status) {
      case 'placed': return '25%';
      case 'preparing': return '50%';
      case 'ready': return '75%';
      case 'delivered': return '90%';
      case 'completed': return '100%';
      default: return '0%';
    }
  }

  getTimeSince(timestamp: string): string {
    return this.kdsService.getTimeSinceOrder(timestamp);
  }

  getFullTimeString(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getWaitingTime(timestamp: string): string {
    const orderDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 10) {
      return '';
    } else if (diffMins > 20) {
      return `(${diffMins} mins overdue)`;
    } else {
      return `(${diffMins} mins waiting)`;
    }
  }
  
  getTimerClass(timestamp: string): string {
    const orderDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins > 20) {
      return 'urgent';
    } else if (diffMins > 10) {
      return 'warning';
    } else {
      return 'on-time';
    }
  }

  updateOrderStatus(status: string): void {
    this.kdsService
      .updateOrderStatus(this.order._id, { status: status as any })
      .subscribe({
        next: () => {
          this.snackBar.open(`Order status updated to ${status}`, 'Close', {
            duration: 3000,
          });
          this.statusChanged.emit();
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to update order status',
            'Close',
            { duration: 5000 }
          );
        },
      });
  }

  updateItemStatus(itemId: string, status: string): void {
    this.kdsService
      .updateOrderItemStatus(this.order._id, itemId, { status: status as any })
      .subscribe({
        next: () => {
          this.snackBar.open(`Item status updated to ${status}`, 'Close', {
            duration: 3000,
          });
          this.statusChanged.emit();
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to update item status',
            'Close',
            { duration: 5000 }
          );
        },
      });
  }
  
  trackByItemId(index: number, item: OrderItem): string {
    return item._id;
  }
  
  // This function safely gets the item name, handling null product cases
  getItemName(item: OrderItem): string {
    if (item.product && item.product.name) {
      return item.product.name;
    }
    
    // If product is null or name is missing, return a fallback name based on price
    return `Menu Item (₹${item.price})`;
  }
}