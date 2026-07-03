import express from 'express';
import { createPaymentIntent, webhook, refundPayment } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Webhook must use raw body — handled in server.js before express.json()
router.post('/webhook', webhook);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/refund/:orderId', protect, admin, refundPayment);

export default router;
