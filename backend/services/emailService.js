import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { getQueue } from '../workers/emailWorker.js';

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false }
});

const BRAND = {
  name: 'Silverkaari',
  color: '#b8960c',
  logo: `${process.env.FRONTEND_URL}/logo.png`,
  address: '123 Silver Lane, Mumbai, Maharashtra 400001'
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${BRAND.name}</title>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family:'Segoe UI',sans-serif; }
  .container { max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); padding:32px; text-align:center; }
  .header h1 { color:${BRAND.color}; font-size:28px; letter-spacing:3px; margin:0; text-transform:uppercase; }
  .header p { color:#999; margin:4px 0 0; font-size:12px; letter-spacing:1px; }
  .body { padding:36px; }
  .btn { display:inline-block; background:${BRAND.color}; color:#fff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:600; font-size:14px; margin:20px 0; }
  .footer { background:#f8f8f8; padding:20px; text-align:center; color:#999; font-size:12px; border-top:1px solid #eee; }
  .divider { border:none; border-top:1px solid #eee; margin:24px 0; }
  table.order-table { width:100%; border-collapse:collapse; }
  table.order-table th { background:#f8f8f8; padding:10px; text-align:left; font-size:12px; text-transform:uppercase; color:#999; }
  table.order-table td { padding:12px 10px; border-bottom:1px solid #f0f0f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>${BRAND.name}</h1>
    <p>Handcrafted with Heritage</p>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p>${BRAND.name} · ${BRAND.address}</p>
    <p style="margin-top:8px;">You received this email because you have an account with us.</p>
  </div>
</div>
</body>
</html>`;

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const queue = getQueue();
    if (queue) {
      await queue.add('send-email', { to, subject, html, text: text || html.replace(/<[^>]*>/g, '') }, {
        attempts: 3, backoff: { type: 'exponential', delay: 2000 }
      });
      return { queued: true };
    }
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `${BRAND.name} <${process.env.SMTP_USER}>`,
      to, subject, html,
      text: text || html.replace(/<[^>]*>/g, '')
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

export const sendWelcomeEmail = async (email, name) => sendEmail({
  to: email,
  subject: `Welcome to ${BRAND.name}! 🎉`,
  html: baseTemplate(`
    <h2 style="color:#1a1a2e;">Welcome, ${name}!</h2>
    <p style="color:#555;line-height:1.6;">Thank you for joining <strong>${BRAND.name}</strong> — where every piece tells a story of craftsmanship and heritage.</p>
    <p style="color:#555;line-height:1.6;">Explore our exclusive collection of handcrafted silver jewelry, idols, and custom pieces.</p>
    <a href="${process.env.FRONTEND_URL}" class="btn">Start Exploring</a>
  `)
});

export const sendEmailVerification = async (email, name, token) => sendEmail({
  to: email,
  subject: `Verify your ${BRAND.name} account`,
  html: baseTemplate(`
    <h2 style="color:#1a1a2e;">Verify Your Email</h2>
    <p style="color:#555;line-height:1.6;">Hi ${name}, please click the button below to verify your email address. This link expires in 24 hours.</p>
    <a href="${process.env.BACKEND_URL}/api/auth/verify-email/${token}" class="btn">Verify Email</a>
    <p style="color:#999;font-size:12px;margin-top:20px;">If you didn't create this account, please ignore this email.</p>
  `)
});

export const sendPasswordResetEmail = async (email, name, token) => sendEmail({
  to: email,
  subject: `Reset your ${BRAND.name} password`,
  html: baseTemplate(`
    <h2 style="color:#1a1a2e;">Reset Password</h2>
    <p style="color:#555;line-height:1.6;">Hi ${name}, you requested a password reset. Click below to set a new password. This link expires in 1 hour.</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}" class="btn">Reset Password</a>
    <p style="color:#999;font-size:12px;margin-top:20px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
  `)
});

export const sendOrderConfirmation = async (email, order) => sendEmail({
  to: email,
  subject: `Order Confirmed — #${order.orderNumber} | ${BRAND.name}`,
  html: baseTemplate(`
    <h2 style="color:#1a1a2e;">Order Confirmed! 🎁</h2>
    <p style="color:#555;">Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
    <hr class="divider"/>
    <table class="order-table">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.name}${item.customization?.engraving ? ` (${item.customization.engraving})` : ''}</td>
            <td>${item.quantity}</td>
            <td>₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <hr class="divider"/>
    <p style="text-align:right;"><strong>Subtotal:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
    <p style="text-align:right;"><strong>Tax (18% GST):</strong> ₹${order.tax.toLocaleString('en-IN')}</p>
    <p style="text-align:right;"><strong>Shipping:</strong> ${order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost}</p>
    <p style="text-align:right;font-size:18px;"><strong>Total: ₹${order.finalAmount.toLocaleString('en-IN')}</strong></p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">View Order</a>
    <p style="color:#999;font-size:12px;margin-top:20px;">Delivery within 7–10 business days.</p>
  `)
});

export const sendPaymentConfirmation = async (email, order) => sendEmail({
  to: email,
  subject: `Payment Received — #${order.orderNumber} | ${BRAND.name}`,
  html: baseTemplate(`
    <h2 style="color:#1a1a2e;">Payment Confirmed ✅</h2>
    <p style="color:#555;">Payment for order <strong>#${order.orderNumber}</strong> has been received.</p>
    <p style="color:#555;">Amount: <strong>₹${order.finalAmount.toLocaleString('en-IN')}</strong></p>
    <p style="color:#555;">Transaction ID: <code>${order.payment.transactionId}</code></p>
    <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Track Order</a>
  `)
});
