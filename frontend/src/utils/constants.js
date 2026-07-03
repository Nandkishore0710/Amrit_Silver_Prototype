export const BRAND = {
  name: 'Amrit Silver',
  tagline: 'Handcrafted with Heritage',
  email: 'hello@amritsilver.com',
  phone: '+91 98765 43210',
  address: '123 Silver Lane, Jaipur, Rajasthan 302001',
  social: {
    instagram: 'https://instagram.com/amritsilver',
    facebook: 'https://facebook.com/amritsilver',
    youtube: 'https://youtube.com/@amritsilver',
    twitter: 'https://twitter.com/amritsilver'
  }
};

export const CATEGORIES = [
  { id: 'Mobile Covers', label: 'Mobile Covers', icon: '📱', description: 'Handcrafted silver & brass phone cases' },
  { id: 'Pendants', label: 'Pendants', icon: '🔮', description: 'Spiritual and decorative pendants' },
  { id: 'Idols', label: 'Idols', icon: '🏺', description: 'Divine silver idols for home shrines' },
  { id: 'Jewelry', label: 'Jewelry', icon: '💎', description: 'Necklaces, earrings, and sets' },
  { id: 'Rings', label: 'Rings', icon: '💍', description: 'Statement silver rings' },
  { id: 'Bracelets', label: 'Bracelets', icon: '📿', description: 'Bangles and chain bracelets' },
  { id: 'Chains', label: 'Chains', icon: '⛓️', description: 'Silver chains and necklaces' },
  { id: 'Custom', label: 'Custom', icon: '✨', description: 'Personalized handcrafted pieces' },
  { id: 'Accessories', label: 'Accessories', icon: '🎁', description: 'Silver accessories and more' }
];

export const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Best Selling' }
];

export const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', icon: '🏦', description: 'Google Pay, PhonePe, BHIM' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💰', description: 'Pay when your order arrives' }
];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'blue' },
  { id: 'confirmed', label: 'Confirmed', color: 'indigo' },
  { id: 'processing', label: 'Processing', color: 'yellow' },
  { id: 'shipped', label: 'Shipped', color: 'orange' },
  { id: 'out_for_delivery', label: 'Out for Delivery', color: 'amber' },
  { id: 'delivered', label: 'Delivered', color: 'green' },
  { id: 'cancelled', label: 'Cancelled', color: 'red' },
  { id: 'refunded', label: 'Refunded', color: 'red' }
];

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry', 'Jammu & Kashmir', 'Ladakh'
];

export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 5000; // ₹5000
export const SHIPPING_COST = 150; // ₹150
