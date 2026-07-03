import express from 'express';
import {
  getStats, getRevenueChart, getOrderStatusChart, getTopProducts,
  getUserGrowthChart, getInventoryAlerts, getCategoryPerformance
} from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getStats);
router.get('/stats/revenue', getRevenueChart);
router.get('/stats/orders', getOrderStatusChart);
router.get('/stats/top-products', getTopProducts);
router.get('/stats/users', getUserGrowthChart);
router.get('/stats/categories', getCategoryPerformance);
router.get('/inventory/alerts', getInventoryAlerts);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
