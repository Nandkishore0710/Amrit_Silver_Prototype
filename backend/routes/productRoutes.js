import express from 'express';
import {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
  addReview, getFeaturedProducts, getBestSellers, getNewArrivals, getRelatedProducts
} from '../controllers/productController.js';
import { protect, admin, artisanOrAdmin } from '../middleware/auth.js';
import { upload } from '../services/uploadService.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, artisanOrAdmin, upload.array('images', 5), createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

router.route('/:slug')
  .get(getProductBySlug)
  .put(protect, artisanOrAdmin, upload.array('images', 5), updateProduct)
  .delete(protect, admin, deleteProduct);

router.get('/:slug/related', getRelatedProducts);
router.post('/:id/reviews', protect, addReview);

export default router;
