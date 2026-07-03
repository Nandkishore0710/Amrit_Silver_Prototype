import User from '../models/User.js';
import Order from '../models/Order.js';
import { logger } from '../utils/logger.js';

// ─── Admin: List all users ─────────────────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(filter)
    ]);
    res.status(200).json({
      success: true,
      data: users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

// ─── Admin: Get user by ID ─────────────────────────────────────────────────────
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('orderHistory', 'orderNumber finalAmount status createdAt')
      .lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Get user by id error:', error);
    next(error);
  }
};

// ─── Admin: Update user role / status ─────────────────────────────────────────
export const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

// ─── Admin: Delete user ────────────────────────────────────────────────────────
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

// ─── User: Manage wishlist ─────────────────────────────────────────────────────
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted: !isWishlisted,
      wishlist: user.wishlist
    });
  } catch (error) {
    logger.error('Toggle wishlist error:', error);
    next(error);
  }
};

// ─── User: Get wishlist ────────────────────────────────────────────────────────
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name slug basePrice images discount rating')
      .lean();
    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    logger.error('Get wishlist error:', error);
    next(error);
  }
};

// ─── User: Update cart ─────────────────────────────────────────────────────────
export const updateCart = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cart },
      { new: true, runValidators: true }
    ).populate('cart.product', 'name slug basePrice images');
    res.status(200).json({ success: true, data: user.cart });
  } catch (error) {
    logger.error('Update cart error:', error);
    next(error);
  }
};

// ─── User: Get order history ───────────────────────────────────────────────────
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id })
        .populate('items.product', 'name images slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments({ user: req.user.id })
    ]);
    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get my orders error:', error);
    next(error);
  }
};
