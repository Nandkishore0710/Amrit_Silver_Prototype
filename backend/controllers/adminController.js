import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';

// ─── Admin Stats Overview ──────────────────────────────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const cacheKey = 'admin:stats:overview';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: cached, cached: true });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders, totalRevenue, totalUsers, totalProducts,
      monthOrders, monthRevenue, lastMonthRevenue,
      pendingOrders, lowStockProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { 'payment.status': 'completed' } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { 'payment.status': 'completed', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { 'payment.status': 'completed', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments({ 'variants.stock': { $lt: 5 }, isActive: true })
    ]);

    const currentRevenue = monthRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0
      ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
      : 100;

    const data = {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalProducts,
      monthOrders,
      monthRevenue: currentRevenue,
      revenueGrowth,
      pendingOrders,
      lowStockProducts
    };

    await cacheSet(cacheKey, data, 300); // cache 5 min
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get stats error:', error);
    next(error);
  }
};

// ─── Revenue Chart (last 30 days) ─────────────────────────────────────────────
export const getRevenueChart = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const data = await Order.aggregate([
      { $match: { 'payment.status': 'completed', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$finalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get revenue chart error:', error);
    next(error);
  }
};

// ─── Order Status Distribution ─────────────────────────────────────────────────
export const getOrderStatusChart = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get order status chart error:', error);
    next(error);
  }
};

// ─── Top Selling Products ──────────────────────────────────────────────────────
export const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const data = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1, totalSold: 1, revenue: 1,
          image: { $arrayElemAt: ['$product.images', 0] },
          slug: '$product.slug'
        }
      }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get top products error:', error);
    next(error);
  }
};

// ─── User Growth Chart ─────────────────────────────────────────────────────────
export const getUserGrowthChart = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: startDate }, role: 'user' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get user growth error:', error);
    next(error);
  }
};

// ─── Inventory Alerts (low stock) ─────────────────────────────────────────────
export const getInventoryAlerts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      'variants.stock': { $lt: 10 }
    }).select('name slug images variants').limit(20).lean();

    const alerts = products.map(p => ({
      ...p,
      lowStockVariants: p.variants.filter(v => v.stock < 10)
    }));

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    logger.error('Get inventory alerts error:', error);
    next(error);
  }
};

// ─── Category Performance ──────────────────────────────────────────────────────
export const getCategoryPerformance = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$productData.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          sold: { $sum: '$items.quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Get category performance error:', error);
    next(error);
  }
};
