export const generateReceipt = (order) => {
  if (!order) return;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const receiptContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sales Receipt #${order.order_id}</title>
        <style>
          /* Thermal Paper Optimization */
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #333; font-size: 11px; line-height: 1.4; 
            width: 72mm; margin: 0 auto; padding: 5mm 0;
          }
          
          /* Header - Inspired by Purchase Invoice */
          .header-container { 
            text-align: center;
            border-bottom: 2px solid #3b82f6; 
            padding-bottom: 8px; 
            margin-bottom: 10px; 
          }
          .company-brand h1 { color: #1e40af; font-size: 16px; margin: 0; text-transform: uppercase; }
          .company-brand p { margin: 2px 0; font-size: 9px; color: #666; }
          
          .invoice-type-header { 
            font-weight: bold; color: #64748b; font-size: 12px; 
            margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;
          }

          /* Info Sections */
          .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .label { font-weight: 600; color: #475569; }
          
          .address-box { margin-bottom: 12px; border-top: 1px solid #f1f5f9; padding-top: 8px; }
          .address-box h3 { margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; color: #94a3b8; }
          
          /* Table Styling */
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          th { 
            background-color: #f8fafc; color: #475569; font-size: 9px;
            text-align: left; padding: 6px 4px; border-bottom: 2px solid #e2e8f0; 
          }
          td { padding: 6px 4px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
          
          .item-name { font-size: 10.5px; font-weight: bold; display: block; margin-bottom: 2px; }
          .item-meta { font-size: 9px; color: #64748b; }

          /* Totals Section */
          .totals-container { border-top: 1px solid #e2e8f0; padding-top: 5px; }
          .total-row { display: flex; justify-content: space-between; padding: 2px 4px; }
          .grand-total { 
            font-size: 14px; font-weight: bold; color: #1e40af; 
            background-color: #f0f9ff; padding: 6px 4px; margin-top: 5px;
          }
          
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          .badge { padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
          .badge-success { background: #dcfce7; color: #166534; }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="company-brand">
            <h1>Nizam Varieties</h1>
            <p>Pakuritala Bazar , Tarakanda | 01645-172356</p>
          </div>
          <div class="invoice-type-header">Sales Receipt</div>
        </div>

        <div class="info-row">
          <span><span class="label">ID:</span> #${order.order_id}</span>
          <span>${new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
        </div>

        <div class="address-box">
          <h3>Customer / Payment</h3>
          <div class="info-row">
             <span><strong>${order.name || 'Walk-in Customer'}</strong></span>
             <span class="badge badge-success">${order.payment_method?.toUpperCase() || 'CASH'}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 60%;">Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 25%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item) => `
              <tr>
                <td>
                  <span class="item-name">${item.name}</span>
                  <span class="item-meta">@৳${Number(item.price).toFixed(2)}</span>
                  ${item.discount > 0 ? `<br><small style="color: #dc2626;">Disc: -৳${item.discount}</small>` : ''}
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right; font-weight: 600;">৳${(item.price * item.quantity - (item.discount || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-container">
          <div class="total-row">
            <span>Subtotal</span>
            <span>৳${Number(order.subtotal_amount).toFixed(2)}</span>
          </div>
          ${order.total_discount_amount > 0 ? `
          <div class="total-row" style="color: #dc2626;">
            <span>Total Discount</span>
            <span>-৳${Number(order.total_discount_amount).toFixed(2)}</span>
          </div>` : ''}
          
          <div class="total-row grand-total">
            <span>NET TOTAL</span>
            <span>৳${Number(order.total_amount).toFixed(2)}</span>
          </div>

          <div class="total-row" style="margin-top: 5px; font-size: 10px;">
            <span>Paid Amount</span>
            <span>৳${Number(order.paid_amount || 0).toFixed(2)}</span>
          </div>
          <div class="total-row" style="font-size: 10px;">
            <span class="label">Change Due</span>
            <span class="label">৳${Number(order.change_amount || 0).toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>Goods once sold are not returnable.</p>
          <p>© ${new Date().getFullYear()} Disibin</p>
        </div>
      </body>
    </html>
  `;

  const pri = iframe.contentWindow;
  pri.document.open();
  pri.document.write(receiptContent);
  pri.document.close();

  setTimeout(() => {
    pri.focus();
    pri.print();
    if(iframe.parentNode) document.body.removeChild(iframe);
  }, 500);
};