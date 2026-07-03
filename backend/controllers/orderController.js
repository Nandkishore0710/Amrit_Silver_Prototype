import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import { sendOrderConfirmation } from '../services/emailService.js';
import { cacheDel } from '../config/redis.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'Order must contain at least one item' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });

      let price = product.basePrice;
      if (product.discount?.percentage && product.discount?.validUntil > Date.now()) {
        price = price * (1 - product.discount.percentage / 100);
      }

      let sku;
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (variant) {
          price = variant.discountPrice || variant.price;
          sku = variant.sku;
        }
      }

      orderItems.push({
        product: product._id,
        variant: item.variantId || null,
        name: product.name,
        sku,
        quantity: item.quantity,
        price: Math.round(price * 100) / 100,
        customization: item.customization || {},
        image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
      });
      totalAmount += price * item.quantity;
    }

    const tax = Math.round(totalAmount * 0.18 * 100) / 100;
    const shippingCost = totalAmount > 5000 ? 0 : 150;
    const discountAmount = 0; // coupon logic placeholder
    const finalAmount = Math.round((totalAmount + tax + shippingCost - discountAmount) * 100) / 100;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      tax, shippingCost, discountAmount, finalAmount,
      couponCode,
      shipping: { address: shippingAddress },
      payment: { method: paymentMethod, status: 'pending' },
      notes,
      statusHistory: [{ status: 'pending', note: 'Order placed successfully' }]
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { orderHistory: order._id } });
    await sendOrderConfirmation(req.user.email, order);

    // Emit to admin via Socket.IO
    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('new:order', { orderId: order._id, orderNumber: order.orderNumber, finalAmount });

    await cacheDel(`orders:user:${req.user.id}`);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    logger.error('Create order error:', error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name images slug')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Order.countDocuments(filter)
    ]);
    res.status(200).json({
      success: true, data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images slug')
      .populate('user', 'name email phone')
      .lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
    if (carrier) order.shipping.carrier = carrier;
    if (status === 'shipped') order.shipping.shippedAt = new Date();
    if (status === 'delivered') {
      order.shipping.deliveredAt = new Date();
      await Product.bulkWrite(order.items.map(item => ({
        updateOne: { filter: { _id: item.product }, update: { $inc: { totalSold: item.quantity } } }
      })));
    }

    // Push to status history with custom note
    order.statusHistory.push({ status, note: note || `Status updated to ${status}`, updatedBy: req.user.id });
    await order.save({ validateBeforeSave: false }); // skip pre-save double push

    // Broadcast to admin
    const io = req.app.get('io');
    if (io) io.to('admin-room').emit('order:updated', { orderId: order._id, status });

    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) { next(error); }
};

// Admin: all orders with filters
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Order.countDocuments(filter)
    ]);
    res.status(200).json({
      success: true, data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};
