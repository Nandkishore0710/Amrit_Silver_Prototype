// SilverIne Product Seed — Contemporary minimalist aesthetic (contrast to Silverkaari's heritage theme)
import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from './logger.js';

const products = [
  {
    name: 'Minimalist 925 Silver iPhone Ring',
    slug: 'minimalist-925-silver-iphone-ring',
    description: 'Clean-lined sterling silver ring for iPhone 14/15. Ultra-thin 2mm band with magnetic popsocket mount. The embodiment of less-is-more design philosophy. Weight: 38g.',
    shortDescription: 'Ultra-thin 925 Silver phone ring with magnetic mount.',
    category: 'Mobile Covers',
    subcategory: 'Ring Stand',
    tags: ['Handcrafted', 'New Arrival', 'Minimalist'],
    basePrice: 6500,
    discount: { percentage: 12, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    images: [
      { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800', alt: 'Silver Ring', isPrimary: true }
    ],
    variants: [{ metal: '925 Silver', purity: '92.5', price: 6500, stock: 18, sku: 'SI-MR-001', attributes: { finish: 'Brushed' } }],
    featured: true, bestSeller: false, newArrival: true
  },
  {
    name: 'Geometric Pure Silver Pendant',
    slug: 'geometric-pure-silver-pendant',
    description: 'Sacred geometry hexagon pendant in 925 sterling silver. 3cm diameter, hand-polished to a mirror finish. Comes with an 18-inch silver chain.',
    shortDescription: 'Hexagon geometry 925 Silver pendant with chain.',
    category: 'Pendants',
    subcategory: 'Geometric',
    tags: ['Handcrafted', 'Best Seller'],
    basePrice: 3200,
    images: [
      { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800', alt: 'Geometric Pendant', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 3200, stock: 30, sku: 'SI-GP-001-P', attributes: { finish: 'Polished' } },
      { metal: '925 Silver', purity: '92.5', price: 3200, stock: 20, sku: 'SI-GP-001-M', attributes: { finish: 'Matte' } }
    ],
    featured: true, bestSeller: true, newArrival: false
  },
  {
    name: 'Silver Moonstone Ring',
    slug: 'silver-moonstone-ring',
    description: 'Genuine moonstone cabochon set in 925 sterling silver. Size adjustable band. The stone exhibits adularescence (blue glow). Each stone is unique.',
    shortDescription: 'Genuine moonstone in 925 Silver adjustable ring.',
    category: 'Rings',
    subcategory: 'Gemstone',
    tags: ['Handcrafted', 'Limited Edition', 'Trending'],
    basePrice: 4800,
    discount: { percentage: 8, validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
    images: [
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', alt: 'Moonstone Ring', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 4800, stock: 12, sku: 'SI-MN-001', attributes: { finish: 'Polished' } }
    ],
    featured: true, bestSeller: false, newArrival: true
  },
  {
    name: 'Silver Dragon Bracelet',
    slug: 'silver-dragon-bracelet',
    description: 'Bold 3D dragon head clasp bracelet in 925 silver. 8.5 inches adjustable. Heavy 45g of sterling silver. Statement piece for the bold.',
    shortDescription: 'Bold 925 silver dragon bracelet, 45g, adjustable.',
    category: 'Bracelets',
    subcategory: 'Dragon',
    tags: ['Handcrafted', 'Trending', 'Best Seller'],
    basePrice: 8900,
    images: [
      { url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800', alt: 'Dragon Bracelet', isPrimary: true }
    ],
    variants: [{ metal: '925 Silver', purity: '92.5', price: 8900, stock: 8, sku: 'SI-DB-001', attributes: { finish: 'Antique' } }],
    featured: false, bestSeller: true, newArrival: false
  },
  {
    name: 'Personalised Name Necklace',
    slug: 'personalised-name-necklace',
    description: 'Hand-cut cursive name necklace in 925 sterling silver. Up to 10 characters. Available in English and Hindi script. 45cm chain included.',
    shortDescription: 'Custom name necklace in 925 Silver — English or Hindi.',
    category: 'Chains',
    subcategory: 'Name',
    tags: ['Customizable', 'Best Seller', 'Handcrafted'],
    basePrice: 3800,
    images: [
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', alt: 'Name Necklace', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 3800, stock: 50, sku: 'SI-NN-001-E', attributes: { finish: 'Polished', style: 'English' } },
      { metal: '925 Silver', purity: '92.5', price: 4200, stock: 30, sku: 'SI-NN-001-H', attributes: { finish: 'Polished', style: 'Hindi' } }
    ],
    featured: true, bestSeller: true, newArrival: false
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(products);
      logger.info(`[SilverIne] Database seeded with ${products.length} products`);
    }

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists && process.env.ADMIN_EMAIL) {
      await User.create({
        name: 'SilverIne Admin',
        email: process.env.ADMIN_EMAIL,
        password: 'Admin@2026#Secure',
        role: 'admin',
        isEmailVerified: true
      });
      logger.info(`[SilverIne] Admin created: ${process.env.ADMIN_EMAIL}`);
    }
  } catch (error) {
    logger.error('[SilverIne] Seeding error:', error);
  }
};
