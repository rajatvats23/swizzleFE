import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { CheckoutPrintService } from './checkout-print.service';

// Interfaces
export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  selectedAddons?: Array<{
    addon: { name: string; _id: string };
    subAddon: { name: string; price: number; _id: string };
  }>;
  specialInstructions?: string;
}

export interface CheckoutOrder {
  _id: string;
  orderNumber: string;
  table: {
    tableNumber: string;
    _id: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  totalAmount: number;
  customer?: {
    name: string;
    phoneNumber: string;
    email?: string;
  };
  specialInstructions?: string;
  createdAt: string;
}

@Component({
  selector: 'app-pos-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class PosCheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private print = inject(CheckoutPrintService);

  // Signals for reactive state management
  selectedPaymentMethod = signal<'cash' | 'card' | 'upi' | 'wallet' | null>(null);
  qrTimer = signal<string>('5:00');

  order: CheckoutOrder | null = null;
  isLoading = false;
  isProcessing = false;
  paymentStatus: { type: 'success' | 'error' | 'warning', message: string } | null = null;

  private subscription = new Subscription();
  private qrTimerSubscription?: Subscription;

  paymentForm: FormGroup = this.fb.group({
    // Card fields
    cardNumber: [''],
    cardExpiry: [''],
    cardCvv: [''],
    cardholderName: [''],
    
    // Wallet fields
    walletType: [''],
    walletMobile: [''],
  });

  ngOnInit(): void {
    // Load static data immediately
    this.loadStaticOrder();

    // Update current time every minute
    this.subscription.add(
      interval(60000).subscribe(() => {
        // Force change detection for time display
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.qrTimerSubscription?.unsubscribe();
  }

  private loadStaticOrder(): void {
    // Static order data for UI testing
    this.order = {
      _id: 'order_123',
      orderNumber: 'A8F2K1',
      table: { tableNumber: '12', _id: 'table_12' },
      items: [
        {
          _id: '1',
          product: { _id: 'p1', name: 'Butter Chicken', price: 240 },
          quantity: 2,
          price: 240,
          selectedAddons: [
            { addon: { name: 'Spice Level', _id: 'a1' }, subAddon: { name: 'Extra Spicy', price: 0, _id: 'sa1' } }
          ]
        },
        {
          _id: '2',
          product: { _id: 'p2', name: 'Garlic Naan', price: 70 },
          quantity: 3,
          price: 70
        },
        {
          _id: '3',
          product: { _id: 'p3', name: 'Basmati Rice', price: 80 },
          quantity: 2,
          price: 80
        },
        {
          _id: '4',
          product: { _id: 'p4', name: 'Mango Lassi', price: 90 },
          quantity: 2,
          price: 90,
          specialInstructions: 'Less sweet'
        }
      ],
      subtotal: 1030,
      tax: 185.40,
      serviceCharge: 103,
      totalAmount: 1318.40,
      createdAt: new Date().toISOString()
    };
  }

  selectPaymentMethod(method: 'cash' | 'card' | 'upi' | 'wallet'): void {
    this.selectedPaymentMethod.set(method);
    this.paymentStatus = null;

    // Reset form validation based on selected method
    this.resetFormValidation();

    // Generate QR timer for UPI
    if (method === 'upi') {
      this.startQrTimer();
    } else {
      this.qrTimerSubscription?.unsubscribe();
    }
  }

  private resetFormValidation(): void {
    const method = this.selectedPaymentMethod();
    
    // Reset all validators first
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.clearValidators();
      this.paymentForm.get(key)?.updateValueAndValidity();
    });

    // Add validators based on selected method
    if (method === 'card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required]);
      this.paymentForm.get('cardExpiry')?.setValidators([Validators.required]);
      this.paymentForm.get('cardCvv')?.setValidators([Validators.required]);
      this.paymentForm.get('cardholderName')?.setValidators([Validators.required]);
    } else if (method === 'wallet') {
      this.paymentForm.get('walletType')?.setValidators([Validators.required]);
      this.paymentForm.get('walletMobile')?.setValidators([Validators.required]);
    }

    // Update validity
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  private startQrTimer(): void {
    this.qrTimerSubscription?.unsubscribe();
    let timeLeft = 300; // 5 minutes in seconds

    this.qrTimerSubscription = interval(1000)
      .pipe(
        map(() => {
          timeLeft--;
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }),
        takeWhile(() => timeLeft > 0)
      )
      .subscribe({
        next: timeString => this.qrTimer.set(timeString),
        complete: () => {
          // Timer expired
          this.paymentStatus = {
            type: 'warning',
            message: 'QR code has expired. Please select UPI payment again to generate a new code.'
          };
        }
      });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    input.value = value;
    this.paymentForm.get('cardNumber')?.setValue(value);
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
    this.paymentForm.get('cardExpiry')?.setValue(value);
  }

  getStatusIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  async processPayment(): Promise<void> {
    if (!this.order || !this.selectedPaymentMethod() || this.isProcessing) return;

    const method = this.selectedPaymentMethod()!;
    
    this.isProcessing = true;
    this.paymentStatus = null;

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      this.paymentStatus = {
        type: 'success',
        message: 'Payment processed successfully!'
      };

      this.snackBar.open('Payment completed successfully!', 'Close', { duration: 5000 });

    } catch (error: any) {
      this.paymentStatus = {
        type: 'error',
        message: error.message || 'Payment processing failed. Please try again.'
      };
    } finally {
      this.isProcessing = false;
    }
  }

  printBill(): void {
    if (!this.order) return;
    this.print.printCustomerBill(this.order)
    // Simulate bill printing
    this.snackBar.open('Bill sent to printer', 'Close', { duration: 3000 });
  }

  splitBill(): void {
    if (!this.order) return;
    
    // Simulate bill splitting
    this.snackBar.open('Bill splitting feature coming soon!', 'Close', { duration: 3000 });
  }
}