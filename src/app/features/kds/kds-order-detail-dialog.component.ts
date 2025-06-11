import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KitchenDisplayService } from './kds.service';
import { Order, OrderItem } from './models/kds.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../payments/payment.service';
import { trigger, transition, style, animate } from '@angular/animations';

interface OrderDetailData {
  orderId: string;
}

@Component({
  selector: 'app-kds-order-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    RouterLink,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <div class="dialog-header" *ngIf="order" @fadeIn>
      <h2 mat-dialog-title>Order #{{getOrderNumber()}}</h2>
      <div class="header-actions">
        <mat-chip [color]="getStatusColor(order.status)" selected>
          {{ order.status | titlecase }}
        </mat-chip>
      </div>
    </div>
    
    <div mat-dialog-content *ngIf="order" @slideUp>
      <div class="order-meta">
        <div class="meta-section">
          <div class="meta-item">
            <span class="label">Table:</span>
            <span class="value table-value">
              <mat-icon class="material-symbols-outlined">table_restaurant</mat-icon>
              {{ order.table.tableNumber }}
            </span>
          </div>
          <div class="meta-item">
            <span class="label">Time:</span>
            <span class="value">{{ formatDateTime(order.createdAt) }}</span>
          </div>
        </div>

        <div class="meta-section" *ngIf="isCustomerObject()">
          <h3 class="section-title">Customer Info</h3>
          <div class="meta-item">
            <span class="label">Name:</span>
            <span class="value">{{ getCustomerName() }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Phone:</span>
            <span class="value">{{ getCustomerPhone() }}</span>
          </div>
        </div>
      </div>

      <mat-divider class="section-divider"></mat-divider>

      <div class="order-items">
        <h3 class="section-title">Order Items</h3>

        <div class="item-card" *ngFor="let item of order.items" @fadeIn>
          <div class="item-header">
            <div class="item-title">
              <span class="quantity">{{ item.quantity }}×</span>
              <span class="name">{{ getItemName(item) }}</span>
            </div>
            <div class="item-status">
              <span class="label">Status:</span>
              <mat-select
                [(ngModel)]="item.status"
                (selectionChange)="updateItemStatus(item._id, item.status)"
                [disabled]="isUpdating"
                class="status-select"
              >
                <mat-option value="ordered">Ordered</mat-option>
                <mat-option value="preparing">Preparing</mat-option>
                <mat-option value="ready">Ready</mat-option>
                <mat-option value="delivered">Delivered</mat-option>
              </mat-select>
            </div>
          </div>

          <div
            class="item-addons"
            *ngIf="item.selectedAddons && item.selectedAddons.length"
          >
            <div
              class="addon"
              *ngFor="let addonSelection of item.selectedAddons"
            >
              <span class="addon-name">{{ addonSelection.addon.name }}:</span>
              <span class="addon-value">{{
                addonSelection.subAddon.name
              }}</span>
              <span class="addon-price"
                >(+{{ addonSelection.subAddon.price | currency }})</span
              >
            </div>
          </div>

          <div class="item-instructions" *ngIf="item.specialInstructions">
            <mat-icon class="material-symbols-outlined" color="warn"
              >priority_high</mat-icon
            >
            <span>{{ item.specialInstructions }}</span>
          </div>

          <div class="item-price">
            <span>{{ item.price * item.quantity | currency }}</span>
          </div>
        </div>
      </div>

      <mat-divider class="section-divider"></mat-divider>

      <div class="order-notes" *ngIf="order.specialInstructions">
        <h3 class="section-title">Special Instructions</h3>
        <div class="note-box">
          <mat-icon class="material-symbols-outlined" color="warn"
            >info</mat-icon
          >
          <span>{{ order.specialInstructions }}</span>
        </div>
      </div>

      <div class="order-summary">
        <div class="total-amount">
          <span class="label">Total Amount:</span>
          <span class="value">{{ order.totalAmount | currency }}</span>
        </div>
      </div>
      
      <mat-divider class="section-divider"></mat-divider>

      <div class="payment-actions">
        <h3 class="section-title">Payment Options</h3>
        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="recordCashPayment()" [disabled]="isProcessing" class="payment-button">
            <mat-icon class="material-symbols-outlined">payments</mat-icon> Record Cash Payment
          </button>
          <a mat-stroked-button [routerLink]="['/payments/order', order._id]" 
             color="primary" (click)="dialogRef.close()" class="payment-button">
            <mat-icon class="material-symbols-outlined">receipt_long</mat-icon> View Payments
          </a>
        </div>
      </div>
    </div>

    <div class="loading-content" *ngIf="isLoading && !order">
      <mat-icon class="material-symbols-outlined spinning">hourglass_top</mat-icon>
      <p>Loading order details...</p>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="isUpdating || !canUpdateStatus()"
        *ngIf="order"
        (click)="updateOrderStatus()"
      >
        {{ getNextStatusButtonText() }}
      </button>
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
    
    /* Dialog Header */
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      margin-bottom: 8px;
    }
    
    h2.mat-dialog-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-color);
    }
    
    /* Order Meta */
    .order-meta {
      display: flex;
      gap: 32px;
      margin-bottom: 24px;
    }
    
    .meta-section {
      flex: 1;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
      margin-top: 0;
      position: relative;
      display: inline-block;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      border-radius: 3px;
    }
    
    .meta-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
    
    .label {
      font-weight: 500;
      margin-right: 8px;
      min-width: 80px;
      color: var(--text-light);
    }
    
    .value {
      font-weight: 500;
      color: var(--text-color);
    }
    
    .table-value {
      display: flex;
      align-items: center;
      gap: 6px;
      
      mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        color: var(--primary-color);
      }
    }
    
    .section-divider {
      margin: 24px 0;
    }
    
    /* Items Section */
    .item-card {
      background-color: #f8f8f8;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .item-title {
      display: flex;
      align-items: center;
    }
    
    .quantity {
      font-weight: 700;
      margin-right: 8px;
      color: var(--primary-color);
    }
    
    .name {
      font-weight: 600;
    }
    
    .item-status {
      display: flex;
      align-items: center;
    }
    
    .status-select {
      min-width: 140px;
    }
    
    .item-addons {
      margin: 10px 0;
      padding-left: 16px;
    }
    
    .addon {
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--text-light);
    }
    
    .addon-name {
      font-weight: 600;
      margin-right: 4px;
    }
    
    .addon-price {
      color: var(--text-light);
      margin-left: 4px;
    }
    
    .item-instructions {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background-color: rgba(243, 156, 18, 0.1);
      padding: 10px 12px;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 14px;
    }
    
    .item-instructions mat-icon {
      color: var(--warning-color);
      font-size: 18px;
      height: 18px;
      width: 18px;
    }
    
    .item-price {
      text-align: right;
      margin-top: 10px;
      font-weight: 600;
      color: var(--text-color);
    }
    
    /* Notes Section */
    .note-box {
      background-color: rgba(243, 156, 18, 0.1);
      padding: 16px;
      border-radius: 10px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .note-box mat-icon {
      color: var(--warning-color);
      font-size: 20px;
      height: 20px;
      width: 20px;
    }
    
    /* Order Summary */
    .order-summary {
      margin: 24px 0;
      text-align: right;
    }
    
    .total-amount {
      font-size: 20px;
    }
    
    .total-amount .value {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Payment Actions */
    .payment-actions {
      margin-top: 16px;
      margin-bottom: 8px;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
    }
    
    .payment-button {
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    /* Loading State */
    .loading-content {
      padding: 40px 24px;
      text-align: center;
      color: var(--text-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .spinning {
      font-size: 40px;
      height: 40px;
      width: 40px;
      animation: spin 1.5s infinite linear;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Responsive Design */
    @media (max-width: 600px) {
      .order-meta {
        flex-direction: column;
        gap: 16px;
      }
      
      .item-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `],
})
export class KdsOrderDetailDialogComponent implements OnInit {
  private kdsService = inject(KitchenDisplayService);
  private paymentService = inject(PaymentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  order: Order | null = null;
  isLoading = true;
  isUpdating = false;
  isProcessing = false;

  constructor(
    public dialogRef: MatDialogRef<KdsOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailData
  ) {}

  ngOnInit(): void {
    if (this.data.orderId) {
      this.loadOrderDetails(this.data.orderId);
    }
  }
  
  getOrderNumber(): string {
    if (!this.order) return '';
    return this.order._id.slice(-6).toUpperCase();
  }

  loadOrderDetails(orderId: string): void {
    this.isLoading = true;
    this.kdsService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.order = response.data.order;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Failed to load order details',
          'Close',
          { duration: 5000 }
        );
        this.isLoading = false;
        this.dialogRef.close();
      },
    });
  }

  formatDateTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'placed':
        return 'warn';
      case 'preparing':
        return 'accent';
      case 'ready':
        return 'primary';
      default:
        return '';
    }
  }

  // Safely gets the item name, handling null product cases
  getItemName(item: OrderItem): string {
    if (item.product && item.product.name) {
      return item.product.name;
    }
    // If product is null or name is missing, return a fallback name based on price
    return `Menu Item (₹${item.price})`;
  }

  updateItemStatus(itemId: string, newStatus: string): void {
    if (!this.order) return;

    this.isUpdating = true;
    this.kdsService
      .updateOrderItemStatus(this.order._id, itemId, {
        status: newStatus as any,
      })
      .subscribe({
        next: () => {
          this.snackBar.open(`Item status updated to ${newStatus}`, 'Close', {
            duration: 3000,
          });
          this.isUpdating = false;
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to update item status',
            'Close',
            { duration: 5000 }
          );
          this.isUpdating = false;
          // Reload to get current state
          this.loadOrderDetails(this.order!._id);
        },
      });
  }

  canUpdateStatus(): boolean {
    if (!this.order) return false;

    // Can't update completed orders
    return this.order.status !== 'completed';
  }

  getNextStatus(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case 'placed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      case 'delivered':
        return 'completed';
      default:
        return '';
    }
  }

  getNextStatusButtonText(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case 'placed':
        return 'Start Preparing';
      case 'preparing':
        return 'Mark as Ready';
      case 'ready':
        return 'Mark as Delivered';
      case 'delivered':
        return 'Complete Order';
      default:
        return '';
    }
  }

  isCustomerObject(): boolean {
    return Boolean(this.order?.customer && typeof this.order.customer !== 'string');
  }
  
  getCustomerName(): string {
    return this.isCustomerObject() ? (this.order!.customer as any).name : 'N/A';
  }
  
  getCustomerPhone(): string {
    return this.isCustomerObject() ? (this.order!.customer as any).phoneNumber : 'N/A';
  }

  updateOrderStatus(): void {
    if (!this.order) return;

    const nextStatus = this.getNextStatus();
    if (!nextStatus) return;

    this.isUpdating = true;
    this.kdsService
      .updateOrderStatus(this.order._id, { status: nextStatus as any })
      .subscribe({
        next: (response) => {
          this.order = response.data.order;
          this.snackBar.open(`Order status updated to ${nextStatus}`, 'Close', {
            duration: 3000,
          });
          this.isUpdating = false;

          if (nextStatus === 'completed') {
            // Close dialog if order is completed
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to update order status',
            'Close',
            { duration: 5000 }
          );
          this.isUpdating = false;
        },
      });
  }
  
  recordCashPayment(): void {
    if (!this.order) return;
    
    this.isProcessing = true;
    this.paymentService.recordCashPayment(this.order._id).subscribe({
      next: () => {
        this.snackBar.open('Cash payment recorded successfully', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.isProcessing = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to record payment', 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isProcessing = false;
      }
    });
  }
}