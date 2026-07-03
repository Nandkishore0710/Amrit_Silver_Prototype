import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'artisan'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpire: { type: Date, select: false },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String, match: [/^[0-9]{6}$/, 'Pincode must be 6 digits'] },
    country: { type: String, default: 'India' }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1, default: 1 },
    customization: {
      engraving: { type: String, maxlength: 30 },
      size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL'] }
    }
  }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual: cart item count
userSchema.virtual('cartCount').get(function() {
  return this.cart.reduce((sum, item) => sum + item.quantity, 0);
});

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);
export default User;
