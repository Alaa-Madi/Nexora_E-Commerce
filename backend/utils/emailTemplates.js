function currency(amount) {
  const num = Number(amount || 0);
  return `$${num.toFixed(2)}`;
}

exports.orderConfirmationTemplate = function orderConfirmationTemplate({ appName = 'Your Store', user, order, items }) {
  const userName = (user && (user.name || user.email || 'Customer'));
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleString();
  const rows = (items || []).map((it) => {
    const unit = Number(it.unit_price || it.price || 0);
    const qty = Number(it.quantity || 1);
    const total = unit * qty;
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${it.product_title || it.title || 'Item'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${currency(unit)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${currency(total)}</td>
      </tr>`;
  }).join('');

  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;color:#111827;background:#f3f4f6;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="padding:20px 24px;background:linear-gradient(90deg,#0A1833,#1769FA);color:#ffffff;">
        <h1 style="margin:0;font-size:20px;">${appName}</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="margin:0 0 8px 0;font-size:18px;color:#111827;">Thanks for your purchase, ${userName}!</h2>
        <p style="margin:0 0 16px 0;color:#374151;">Your payment was successful. Here are your order details.</p>
        <p style="margin:0 0 16px 0;color:#374151;"><strong>Order #${order.id}</strong> · ${orderDate}</p>

        <table style="border-collapse:collapse;width:100%;margin-top:8px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb">
              <th style="text-align:left;padding:10px 12px;border-bottom:1px solid #e5e7eb">Item</th>
              <th style="text-align:center;padding:10px 12px;border-bottom:1px solid #e5e7eb">Qty</th>
              <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e7eb">Unit</th>
              <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e7eb">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:12px;text-align:right;border-top:2px solid #e5e7eb"><strong>Grand Total:</strong></td>
              <td style="padding:12px;text-align:right;border-top:2px solid #e5e7eb"><strong>${currency(order.total)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <p style="margin:16px 0 0 0;color:#6b7280">If you have any questions, reply to this email.</p>
      </div>
      <div style="padding:16px 24px;background:#f9fafb;color:#6b7280;font-size:12px;">
        <div>© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
      </div>
    </div>
  </div>`;
};


