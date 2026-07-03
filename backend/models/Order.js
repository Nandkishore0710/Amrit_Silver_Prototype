import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  customization: {
    engraving: { type: String, maxlength: 30 },
    size: { type: String },
    notes: { type: String, maxlength: 200 }
  },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: {
    type: String,
    unique: true,
    default: () => `SK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  tax: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'return_requested'],
    default: 'pending'
  },
  payment: {
    method: { type: String, enum: ['stripe', 'cod', 'razorpay', 'upi'] },
    transactionId: { type: String },
    paymentIntentId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'], default: 'pending' },
    paidAt: { type: Date }
  },
  shipping: {
    address: {
      name: { type: String },
      phone: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, match: [/^[0-9]{6}$/] },
      country: { type: String, default: 'India' }
    },
    trackingNumber: { type: String },
    carrier: { type: String },
    estimatedDelivery: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date }
  },
  notes: { type: String, maxlength: 500 },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  isReviewed: { type: Boolean, default: false },
  refundAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      note: `Status updated to ${this.status}`,
      timestamp: new Date()
    });
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'payment.status': 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
