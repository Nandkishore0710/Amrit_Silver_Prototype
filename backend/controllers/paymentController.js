import Stripe from 'stripe';
import Order from '../models/Order.js';
import { logger } from '../utils/logger.js';
import { sendPaymentConfirmation } from '../services/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'email name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (order.payment.status === 'completed') return res.status(400).json({ success: false, message: 'Payment already completed' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.finalAmount * 100), // paise
      currency: 'inr',
      metadata: { orderId: order._id.toString(), userId: req.user.id, orderNumber: order.orderNumber },
      receipt_email: req.user.email,
      description: `Silverkaari order #${order.orderNumber}`
    });

    // Store payment intent id
    order.payment.paymentIntentId = paymentIntent.id;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    next(error);
  }
};

export const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const order = await Order.findById(pi.metadata.orderId).populate('user', 'email');
        if (order) {
          order.payment.status = 'completed';
          order.payment.transactionId = pi.id;
          order.payment.paidAt = new Date();
          order.status = 'confirmed';
          await order.save({ validateBeforeSave: false });
          await sendPaymentConfirmation(order.user.email, order);
          logger.info(`Payment succeeded: order ${pi.metadata.orderId}`);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await Order.findByIdAndUpdate(pi.metadata.orderId, { 'payment.status': 'failed' });
        logger.warn(`Payment failed: order ${pi.metadata.orderId}`);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        if (charge.payment_intent) {
          const order = await Order.findOne({ 'payment.paymentIntentId': charge.payment_intent });
          if (order) {
            order.payment.status = 'refunded';
            order.status = 'refunded';
            order.refundAmount = charge.amount_refunded / 100;
            await order.save({ validateBeforeSave: false });
          }
        }
        break;
      }
      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.payment.status !== 'completed') return res.status(400).json({ success: false, message: 'No completed payment to refund' });

    const refund = await stripe.refunds.create({
      payment_intent: order.payment.paymentIntentId,
      amount: req.body.amount ? Math.round(req.body.amount * 100) : undefined
    });

    res.status(200).json({ success: true, data: refund });
  } catch (error) {
    logger.error('Refund error:', error);
    next(error);
  }
};
