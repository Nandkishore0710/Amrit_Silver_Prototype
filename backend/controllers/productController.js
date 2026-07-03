import Product from '../models/Product.js';
import { logger } from '../utils/logger.js';
import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category, subcategory, minPrice, maxPrice, sort,
      limit = 20, page = 1, search, tags, featured, bestSeller, newArrival
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (featured === 'true') filter.featured = true;
    if (bestSeller === 'true') filter.bestSeller = true;
    if (newArrival === 'true') filter.newArrival = true;
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const sortOptions = {};
    if (sort === 'price-asc') sortOptions.basePrice = 1;
    else if (sort === 'price-desc') sortOptions.basePrice = -1;
    else if (sort === 'rating') sortOptions['rating.average'] = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'popular') sortOptions.totalSold = -1;
    else sortOptions.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const cacheKey = `product:${req.params.slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: cached, cached: true });

    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug, isActive: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('reviews.user', 'name avatar').lean();

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    await cacheSet(cacheKey, product, 3600);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logger.error('Get product by slug error:', error);
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (typeof productData.variants === 'string') productData.variants = JSON.parse(productData.variants);
    if (typeof productData.tags === 'string') productData.tags = JSON.parse(productData.tags);
    if (typeof productData.discount === 'string') productData.discount = JSON.parse(productData.discount);

    if (req.files?.length > 0) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.path, 'products')));
      productData.images = uploads.map((img, i) => ({ url: img.url, publicId: img.publicId, isPrimary: i === 0 }));
    }

    const product = await Product.create(productData);
    await cacheDel('products:featured', 'products:bestsellers', 'products:newarrivals');
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    logger.error('Create product error:', error);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const updateData = { ...req.body };
    if (req.files?.length > 0) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.path, 'products')));
      const newImages = uploads.map((img, i) => ({ url: img.url, publicId: img.publicId, isPrimary: i === 0 }));
      updateData.images = [...(product.images || []), ...newImages];
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    await cacheDel(`product:${updated.slug}`, 'products:featured', 'products:bestsellers');
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error('Update product error:', error);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await cacheDel(`product:${product.slug}`, 'products:featured', 'products:bestsellers');
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    logger.error('Delete product error:', error);
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existingReview = product.reviews.find(r => r.user.toString() === req.user.id);
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    product.reviews.push({ user: req.user.id, name: req.user.name, rating, comment });
    product.recalculateRating();
    await product.save();
    await cacheDel(`product:${product.slug}`);

    res.status(201).json({ success: true, data: product.reviews[product.reviews.length - 1] });
  } catch (error) {
    logger.error('Add review error:', error);
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const cached = await cacheGet('products:featured');
    if (cached) return res.status(200).json({ success: true, data: cached });
    const products = await Product.find({ featured: true, isActive: true }).limit(8).lean();
    await cacheSet('products:featured', products, 1800);
    res.status(200).json({ success: true, data: products });
  } catch (error) { next(error); }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const cached = await cacheGet('products:bestsellers');
    if (cached) return res.status(200).json({ success: true, data: cached });
    const products = await Product.find({ bestSeller: true, isActive: true }).limit(10).lean();
    await cacheSet('products:bestsellers', products, 1800);
    res.status(200).json({ success: true, data: products });
  } catch (error) { next(error); }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const cached = await cacheGet('products:newarrivals');
    if (cached) return res.status(200).json({ success: true, data: cached });
    const products = await Product.find({ newArrival: true, isActive: true }).sort({ createdAt: -1 }).limit(12).lean();
    await cacheSet('products:newarrivals', products, 1800);
    res.status(200).json({ success: true, data: products });
  } catch (error) { next(error); }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(6).lean();
    res.status(200).json({ success: true, data: related });
  } catch (error) { next(error); }
};
