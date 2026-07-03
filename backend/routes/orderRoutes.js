import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder, getAllOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
