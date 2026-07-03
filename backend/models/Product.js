import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  metal: {
    type: String,
    enum: ['925 Silver', 'Brass', 'Copper', 'Sterling Silver', 'Gold Plated'],
    required: true
  },
  purity: { type: String, enum: ['92.5', '99.9', 'Other'], default: '92.5' },
  weight: { type: Number, min: 0 },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  attributes: {
    color: { type: String },
    finish: { type: String, enum: ['Polished', 'Matte', 'Antique', 'Hammered', 'Brushed'] },
    size: { type: String }
  }
}, { _id: true });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  images: [{ type: String }],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  shortDescription: { type: String, maxlength: [200, 'Short description cannot exceed 200 characters'] },
  category: {
    type: String,
    enum: ['Mobile Covers', 'Pendants', 'Idols', 'Jewelry', 'Custom', 'Accessories', 'Chains', 'Rings', 'Bracelets'],
    required: true
  },
  subcategory: {
    type: String,
    enum: ['Hanuman', 'Shiva', 'Ram', 'Krishna', 'Ganesh', 'Lion', 'Horse', 'Peacock', 'Elephant', 'Dragon', 'Custom', 'Other']
  },
  tags: [{ type: String, enum: ['Limited Edition', 'Handcrafted', 'Best Seller', 'New Arrival', 'Customizable', 'Trending', 'Sale'] }],
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  variants: [variantSchema],
  basePrice: { type: Number, required: true, min: 0 },
  discount: {
    percentage: { type: Number, min: 0, max: 100 },
    validUntil: { type: Date }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [reviewSchema],
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  artisan: { type: String },
  heritage: { type: String },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: 'mm' }
  },
  careInstructions: { type: String },
  totalSold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

productSchema.virtual('finalPrice').get(function() {
  if (this.discount?.percentage && this.discount?.validUntil > Date.now()) {
    return Math.round(this.basePrice * (1 - this.discount.percentage / 100) * 100) / 100;
  }
  return this.basePrice;
});

productSchema.virtual('discountedAmount').get(function() {
  return Math.round(this.basePrice - this.finalPrice);
});

// Recalculate average rating after review
productSchema.methods.recalculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = { average: 0, count: 0 };
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
