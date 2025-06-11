import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KdsNotificationService } from './kds-notification.service';
import { Order } from './models/kds.model';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { KdsPrintService } from './kds-print.service';
import { MatDialog } from '@angular/material/dialog';
import { KdsOrderDetailDialogComponent } from './kds-order-detail-dialog.component';

@Component({
  selector: 'app-kds-notification-overlay',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(110%)' }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.34, 0.01, 0.64, 1)', style({ transform: 'translateX(110%)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    <div class="notifications-container" *ngIf="notifications.length > 0">
      <div
        class="notification-card"
        @slideIn
        *ngFor="let order of notifications"
      >
        <div class="notification-header">
          <div class="notification-title">
            <mat-icon class="material-symbols-outlined"
              >notifications_active</mat-icon
            >
            <div class="title-text">
              New Order: Table {{ order.table.tableNumber }}
            </div>
          </div>
          <div class="notification-time">
            {{ formatTime(order.createdAt) }}
          </div>
        </div>

        <div class="notification-content">
          <div class="items-summary">
            <span *ngFor="let item of order.items; let last = last">
              {{ item.quantity }}× {{ item.product.name
              }}{{ !last ? ', ' : '' }}
            </span>
          </div>
        </div>

        <div class="notification-actions">
          <button
            mat-icon-button
            matTooltip="Print Ticket"
            (click)="printOrder(order)"
          >
            <mat-icon class="material-symbols-outlined">print</mat-icon>
          </button>
          <button
            mat-icon-button
            matTooltip="View Details"
            (click)="viewOrderDetails(order)"
          >
            <mat-icon class="material-symbols-outlined">visibility</mat-icon>
          </button>
          <button
            mat-icon-button
            matTooltip="Dismiss"
            (click)="dismissNotification(order._id)"
          >
            <mat-icon class="material-symbols-outlined">close</mat-icon>
          </button>
        </div>
      </div>
    </div>

    <div
      class="sound-toggle"
      [matBadge]="notifications.length"
      [matBadgeHidden]="notifications.length === 0"
      matBadgeColor="warn"
      matBadgeOverlap="true"
      @fadeIn
    >
      <button mat-fab color="primary" (click)="toggleSound()" matTooltip="Toggle Notification Sound">
        <mat-icon class="material-symbols-outlined">
          {{ soundEnabled ? 'volume_up' : 'volume_off' }}
        </mat-icon>
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
    
    /* Notification Container */
    .notifications-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 360px;
      pointer-events: none;
    }
    
    /* Notification Card */
    .notification-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      border-left: 4px solid var(--urgent-color);
      pointer-events: auto;
    }
    
    /* Notification Header */
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background-color: #fff8f8;
    }
    
    .notification-title {
      display: flex;
      align-items: center;
      
      mat-icon {
        color: var(--urgent-color);
        margin-right: 10px;
      }
      
      .title-text {
        font-weight: 600;
        color: var(--urgent-color);
      }
    }
    
    .notification-time {
      font-size: 12px;
      color: var(--text-light);
    }
    
    /* Notification Content */
    .notification-content {
      padding: 16px;
    }
    
    .items-summary {
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-color);
    }
    
    /* Notification Actions */
    .notification-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 10px 16px;
      background-color: #fafafa;
      border-top: 1px solid #f0f0f0;
    }
    
    .notification-actions button {
      background-color: #f4f4f4;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
      
      mat-icon {
        color: var(--text-color);
      }
    }
    
    /* Sound Toggle Button */
    .sound-toggle {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 1000;
      
      button {
        background-color: var(--primary-color);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        transition: all 0.3s var(--timing-function);
        
        &:hover {
          background-color: var(--primary-dark);
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 156, 76, 0.3);
        }
        
        mat-icon {
          font-size: 24px;
          height: 24px;
          width: 24px;
        }
      }
    }
    
    /* Media Queries */
    @media (max-width: 480px) {
      .notifications-container {
        max-width: calc(100vw - 48px);
      }
    }
  `],
})
export class KdsNotificationOverlayComponent implements OnInit, OnDestroy {
  private notificationService = inject(KdsNotificationService);
  private printService = inject(KdsPrintService);
  private dialog = inject(MatDialog);

  notifications: Order[] = [];
  soundEnabled = true;

  private subscription = new Subscription();

  ngOnInit(): void {
    this.soundEnabled = this.notificationService.isSoundEnabled();

    this.subscription.add(
      this.notificationService.notifications$.subscribe((notifications) => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  dismissNotification(orderId: string): void {
    this.notificationService.removeNotification(orderId);
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  printOrder(order: Order): void {
    this.printService.printOrderTicket(order);
  }

  viewOrderDetails(order: Order): void {
    this.dialog.open(KdsOrderDetailDialogComponent, {
      data: { orderId: order._id },
      width: '800px',
      panelClass: 'order-detail-dialog'
    });
    this.dismissNotification(order._id);
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.notificationService.toggleSound(this.soundEnabled);
  }
}