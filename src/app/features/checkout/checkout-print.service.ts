import { Injectable } from '@angular/core';
import { CheckoutOrder } from './checkout.component';

@Injectable({
  providedIn: 'root'
})
export class CheckoutPrintService {
  
  /**
   * Print customer bill/receipt
   */
  printCustomerBill(order: CheckoutOrder): void {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups for this website to print receipts');
      return;
    }
    
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('en-IN');
    const formattedTime = orderDate.toLocaleTimeString('en-IN');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 1cm;
            max-width: 10cm;
            background: white;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #009c4c;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .restaurant-name {
            font-size: 24px;
            font-weight: bold;
            color: #009c4c;
            margin-bottom: 8px;
          }
          .receipt-type {
            font-size: 18px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 12px;
          }
          .order-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 20px;
          }
          .info-item {
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #333;
          }
          .order-items {
            margin: 20px 0;
          }
          .item {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }
          .item-name {
            font-weight: 600;
            color: #333;
            flex: 1;
          }
          .item-quantity {
            background: #009c4c;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin: 0 12px;
          }
          .item-price {
            font-weight: 600;
            color: #009c4c;
            min-width: 70px;
            text-align: right;
          }
          .addon {
            padding-left: 20px;
            font-size: 13px;
            color: #666;
            margin: 2px 0;
          }
          .addon::before {
            content: "+ ";
            color: #009c4c;
            font-weight: bold;
          }
          .special-instructions {
            background: #fff8eb;
            border: 1px solid #009c4c;
            border-radius: 4px;
            padding: 8px;
            margin-top: 8px;
            font-style: italic;
            font-size: 13px;
            color: #333;
          }
          .special-instructions::before {
            content: "📝 ";
            margin-right: 4px;
          }
          .totals-section {
            margin-top: 24px;
            border-top: 2px solid #009c4c;
            padding-top: 16px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #009c4c;
            border-top: 1px solid #009c4c;
            padding-top: 12px;
            margin-top: 16px;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            border-top: 1px dashed #ccc;
            padding-top: 16px;
          }
          .thank-you {
            font-size: 16px;
            font-weight: 600;
            color: #009c4c;
            margin-bottom: 8px;
          }
          .footer-text {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
          
          @media print {
            body {
              max-width: none;
              margin: 0;
              padding: 0.5cm;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <div class="restaurant-name">Restaurant Name</div>
          <div class="receipt-type">Customer Receipt</div>
        </div>
        
        <div class="order-info-grid">
          <div class="info-item">
            <div class="info-label">Order #:</div>
            <div>${order.orderNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Table:</div>
            <div>${order.table.tableNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date:</div>
            <div>${formattedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Time:</div>
            <div>${formattedTime}</div>
          </div>
        </div>
        
        <div class="order-items">
          ${order.items.map(item => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.product.name}</div>
                <div class="item-quantity">${item.quantity}×</div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
              </div>
              ${item.selectedAddons && item.selectedAddons.length > 0 ? 
                item.selectedAddons.map(addon => `
                  <div class="addon">${addon.addon.name}: ${addon.subAddon.name}</div>
                `).join('') : ''}
              ${item.specialInstructions ? 
                `<div class="special-instructions">${item.specialInstructions}</div>` : ''}
            </div>
          `).join('')}
        </div>
        
        ${order.specialInstructions ? `
          <div class="special-instructions">
            <strong>Order Notes:</strong> ${order.specialInstructions}
          </div>
        ` : ''}
        
        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal</span>
            <span>₹${order.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>GST (18%)</span>
            <span>₹${order.tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Service Charge (10%)</span>
            <span>₹${order.serviceCharge.toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total Amount</span>
            <span>₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">Thank You for Dining With Us!</div>
          <div class="footer-text">
            Please visit us again<br>
            Follow us @restaurantname
          </div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }

  /**
   * Print kitchen ticket
   */
  printKitchenTicket(order: CheckoutOrder): void {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups for this website to print kitchen tickets');
      return;
    }
    
    const orderDate = new Date(order.createdAt);
    const formattedTime = orderDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kitchen Ticket - Order #${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0.5cm;
            width: 8cm;
            background: white;
            font-size: 14px;
            line-height: 1.3;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .kitchen-label {
            font-size: 20px;
            font-weight: bold;
            background: #000;
            color: white;
            padding: 8px;
            margin-bottom: 8px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-weight: bold;
          }
          .table-number {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            background: #000;
            color: white;
            padding: 12px;
            margin: 16px 0;
          }
          .order-details {
            margin: 20px 0;
          }
          .item {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #000;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-header {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 6px;
          }
          .quantity {
            background: #000;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 8px;
            font-size: 14px;
          }
          .addon {
            padding-left: 20px;
            font-size: 13px;
            margin: 4px 0;
          }
          .addon::before {
            content: "▸ ";
            font-weight: bold;
          }
          .special-instructions {
            background: #f0f0f0;
            border: 2px solid #000;
            padding: 12px;
            margin: 16px 0;
            font-weight: bold;
            text-transform: uppercase;
          }
          .special-instructions::before {
            content: "⚠️ SPECIAL: ";
            display: block;
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            border-top: 2px solid #000;
            padding-top: 12px;
          }
          .kitchen-footer {
            font-weight: bold;
            font-size: 16px;
          }
          .timestamp {
            font-size: 12px;
            margin-top: 8px;
          }
          
          @media print {
            body {
              width: 8cm;
              margin: 0;
              padding: 0.3cm;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <div class="kitchen-label">🍳 KITCHEN ORDER</div>
          <div class="order-info">
            <div>Order #${order.orderNumber}</div>
            <div>${formattedTime}</div>
          </div>
        </div>
        
        <div class="table-number">
          TABLE ${order.table.tableNumber}
        </div>
        
        <div class="order-details">
          ${order.items.map(item => `
            <div class="item">
              <div class="item-header">
                <span class="quantity">${item.quantity}</span>
                ${item.product.name.toUpperCase()}
              </div>
              ${item.selectedAddons && item.selectedAddons.length > 0 ? 
                item.selectedAddons.map(addon => `
                  <div class="addon">${addon.addon.name}: ${addon.subAddon.name}</div>
                `).join('') : ''}
              ${item.specialInstructions ? 
                `<div class="special-instructions">${item.specialInstructions}</div>` : ''}
            </div>
          `).join('')}
        </div>
        
        ${order.specialInstructions ? `
          <div class="special-instructions">
            ORDER NOTES: ${order.specialInstructions.toUpperCase()}
          </div>
        ` : ''}
        
        <div class="footer">
          <div class="kitchen-footer">*** KITCHEN COPY ***</div>
          <div class="timestamp">Printed: ${new Date().toLocaleString('en-IN')}</div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }

  /**
   * Print both customer receipt and kitchen ticket
   */
  printBoth(order: CheckoutOrder): void {
    this.printCustomerBill(order);
    // Delay kitchen ticket to avoid popup blocking
    setTimeout(() => {
      this.printKitchenTicket(order);
    }, 1000);
  }
}