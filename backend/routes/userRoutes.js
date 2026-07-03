import express from 'express';
import {
  getAllUsers, getUserById, updateUser, deleteUser,
  toggleWishlist, getWishlist, updateCart, getMyOrders
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

// User routes
router.get('/me/wishlist', protect, getWishlist);
router.post('/me/wishlist/:productId', protect, toggleWishlist);
router.put('/me/cart', protect, updateCart);
router.get('/me/orders', protect, getMyOrders);

export default router;
