// Currency formatting (INR)
export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

// Date formatting
export const formatDate = (dateString, options = {}) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', ...options
  }).format(new Date(dateString));

export const formatDateTime = (dateString) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString));

// Slug to title
export const slugToTitle = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Calculate discount percentage
export const calcDiscount = (original, discounted) =>
  Math.round(((original - discounted) / original) * 100);

// Truncate text
export const truncate = (text, maxLen = 100) =>
  text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;

// Get primary image
export const getPrimaryImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) return '/placeholder.jpg';
  const img = images.find(img => img.isPrimary) || images[0];
  return typeof img === 'string' ? img : img.url;
};

// Order status colors
export const ORDER_STATUS_COLORS = {
  pending: 'badge-info',
  confirmed: 'badge-silver',
  processing: 'badge-gold',
  shipped: 'badge-gold',
  out_for_delivery: 'badge-gold',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
  refunded: 'badge-danger',
  return_requested: 'badge-danger'
};

// Rating stars array
export const getRatingStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};

// Group cart by seller/category
export const groupCartItems = (items) => items;

// Validate Indian pincode
export const isValidPincode = (pin) => /^[1-9][0-9]{5}$/.test(pin);

// Validate Indian phone
export const isValidPhone = (phone) => /^[6-9][0-9]{9}$/.test(phone);

// Get initials from name
export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

// Local storage helpers
export const ls = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  del: (key) => localStorage.removeItem(key)
};
