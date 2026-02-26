export const printOrder = (order) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* 80mm Optimization */
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              width: 72mm; margin: 0 auto; padding: 5mm 1mm;
              font-size: 11px; color: #333; line-height: 1.4;
            }
            
            /* Branding - Matching Purchase Invoice */
            .header-container { 
              text-align: center; 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 8px; 
              margin-bottom: 10px; 
            }
            .brand-name { color: #1e40af; font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase; }
            .store-detail { font-size: 9px; color: #64748b; margin: 1px 0; }
            .invoice-title { 
              font-weight: bold; color: #64748b; font-size: 12px; 
              margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;
            }

            /* Info Section */
            .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .label { font-weight: 600; color: #475569; font-size: 10px; }
            .value { font-weight: 600; }
            
            .customer-box { 
              margin-bottom: 10px; border-top: 1px solid #f1f5f9; padding-top: 8px; 
            }
            
            /* Table Styling */
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th { 
              background-color: #f8fafc; color: #475569; font-size: 9px;
              text-align: left; padding: 6px 4px; border-bottom: 2px solid #e2e8f0; 
            }
            td { padding: 6px 4px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
            
            .item-name { font-size: 10px; font-weight: bold; display: block; margin-bottom: 1px; }
            .item-meta { font-size: 9px; color: #64748b; }

            /* Totals - Matching Purchase Invoice style */
            .totals-container { border-top: 1px solid #e2e8f0; padding-top: 5px; }
            .total-row { display: flex; justify-content: space-between; padding: 2px 4px; }
            .grand-total { 
              font-size: 14px; font-weight: bold; color: #1e40af; 
              background-color: #f0f9ff; padding: 6px 4px; margin-top: 5px;
            }
            
            .badge { padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
            .badge-success { background: #dcfce7; color: #166534; }

            .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 9px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <h1 class="brand-name">Nizam Varieties</h1>
            <p class="store-detail">Pakuritala Bazar, Tarakanda</p>
            <p class="store-detail">Phone: ${order.phone || '01645-172356'}</p>
            <div class="invoice-title">Sales Receipt</div>
          </div>

          <div class="info-row">
            <span><span class="label">Invoice:</span> #${order.order_id}</span>
            <span>${new Date(order.date || Date.now()).toLocaleDateString()}</span>
          </div>

          <div class="customer-box">
            <div class="info-row">
               <span><span class="label">Customer:</span> ${order.name || 'Walk-in'}</span>
               <span class="badge badge-success">${order.payment_method?.toUpperCase() || 'CASH'}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 55%;">Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 30%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.product_list?.map(item => `
                <tr>
                  <td>
                    <span class="item-name">${item.name}</span>
                    <span class="item-meta">@৳${parseFloat(item.price).toFixed(2)}</span>
                    ${item.discount > 0 ? `<br><small style="color: #dc2626;">Disc: -৳${item.discount}</small>` : ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right; font-weight: 600;">
                    ৳${(parseFloat(item.price) * item.quantity - (item.discount || 0)).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="total-row">
              <span>Sub-Total</span>
              <span>৳${parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            
            ${order.discount > 0 ? `
            <div class="total-row" style="color: #dc2626;">
              <span>Total Discount</span>
              <span>-৳${parseFloat(order.discount).toFixed(2)}</span>
            </div>` : ''}

            <div class="total-row grand-total">
              <span>NET TOTAL</span>
              <span>৳${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>

            <div style="margin-top: 5px;">
              <div class="total-row" style="font-size: 10px;">
                <span>Paid Amount</span>
                <span>৳${parseFloat(order.amount_received || 0).toFixed(2)}</span>
              </div>
              <div class="total-row" style="font-size: 10px;">
                <span class="label">Change Due</span>
                <span class="value">৳${parseFloat(order.change_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p style="font-weight: bold; color: #64748b;">THANK YOU FOR SHOPPING!</p>
            <p>Exchange within 7 days with receipt</p>
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
        if (iframe.parentNode) document.body.removeChild(iframe);
    }, 600);
}