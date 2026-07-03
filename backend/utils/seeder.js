import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from './logger.js';

const products = [
  {
    name: 'Hanuman Gada Brass Mobile Case',
    slug: 'hanuman-gada-brass-mobile-case',
    description: 'Handcrafted brass mobile case featuring Lord Hanuman\'s Gada in intricate relief work. Each piece is individually crafted by master artisans from Rajasthan, taking 4-6 hours to complete.',
    shortDescription: 'Hand-engraved brass case with Hanuman Gada design.',
    category: 'Mobile Covers',
    subcategory: 'Hanuman',
    tags: ['Handcrafted', 'New Arrival'],
    basePrice: 4800,
    discount: { percentage: 10, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', alt: 'Hanuman Gada Brass Case', isPrimary: true }
    ],
    variants: [{ metal: 'Brass', purity: 'Other', price: 4800, stock: 20, sku: 'HG-BR-001', attributes: { finish: 'Antique' } }],
    featured: true, bestSeller: false, newArrival: true,
    artisan: 'Ramesh Choudhary, Jaipur',
    heritage: 'Rajasthani brass craft tradition, 200+ years old'
  },
  {
    name: 'Horse Engraved 925 Silver Mobile Cover',
    slug: 'horse-engraved-925-silver-mobile-cover',
    description: 'Sterling silver mobile cover with hand-engraved running horse motif. Made from 92.5% pure silver with polished finish. Compatible with iPhone 14 Pro/15. Certificate of authenticity included.',
    shortDescription: '925 Sterling Silver cover with horse engraving. Certificate included.',
    category: 'Mobile Covers',
    subcategory: 'Horse',
    tags: ['Handcrafted', 'Limited Edition', 'Best Seller'],
    basePrice: 18000,
    discount: { percentage: 15, validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', alt: 'Horse Engraved Silver Cover', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 18000, stock: 15, sku: 'HS-925-002', attributes: { finish: 'Polished' } },
      { metal: '925 Silver', purity: '92.5', price: 19500, stock: 8, sku: 'HS-925-002M', attributes: { finish: 'Matte' } }
    ],
    featured: true, bestSeller: true, newArrival: true,
    artisan: 'Meenakshi Silver Works, Jaipur',
    heritage: 'Jadau craft heritage — over 500 years of royal patronage'
  },
  {
    name: 'Ganesha 925 Silver Idol',
    slug: 'ganesha-925-silver-idol',
    description: 'Handcrafted Lord Ganesha idol in pure 925 Sterling Silver. Standing 6 inches tall with intricate detailing including crown, lotus, modak and mouse. Ideal for home shrines and gifting.',
    shortDescription: '6-inch 925 Silver Ganesha idol, handcrafted.',
    category: 'Idols',
    subcategory: 'Ganesh',
    tags: ['Handcrafted', 'Best Seller', 'Customizable'],
    basePrice: 35000,
    images: [
      { url: 'https://images.unsplash.com/photo-1567591570506-c01d1d2b1b12?w=800', alt: 'Silver Ganesha Idol', isPrimary: true }
    ],
    variants: [{ metal: '925 Silver', purity: '92.5', price: 35000, stock: 5, sku: 'GN-925-003', weight: 250 }],
    featured: true, bestSeller: true, newArrival: false,
    artisan: 'Pratap Silversmiths, Varanasi',
    heritage: 'Varanasi silver craft — 700 year old tradition of temple idol crafting'
  },
  {
    name: 'Shiva Trishul Brass Pendant',
    slug: 'shiva-trishul-brass-pendant',
    description: 'Bold and spiritual Lord Shiva Trishul pendant in aged brass with black patina finish. 3.5 cm height with a strong steel bail. Comes with a 24-inch black cord.',
    shortDescription: 'Antique brass Trishul pendant, spiritual and bold.',
    category: 'Pendants',
    subcategory: 'Shiva',
    tags: ['Handcrafted', 'New Arrival', 'Trending'],
    basePrice: 1200,
    images: [
      { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800', alt: 'Shiva Trishul Pendant', isPrimary: true }
    ],
    variants: [{ metal: 'Brass', purity: 'Other', price: 1200, stock: 50, sku: 'ST-BR-004', attributes: { finish: 'Antique' } }],
    featured: false, bestSeller: false, newArrival: true,
    artisan: 'Kashi Craft Collective, Varanasi'
  },
  {
    name: 'Silver Lion Ring',
    slug: 'silver-lion-ring',
    description: 'Striking lion-face sterling silver ring. Heavy cast in 925 silver with detailed mane and eyes. Available in sizes 6-12. Each ring is polished and rhodium plated for lasting shine.',
    shortDescription: '925 Silver lion face statement ring. Sizes 6–12.',
    category: 'Rings',
    subcategory: 'Lion',
    tags: ['Handcrafted', 'Trending'],
    basePrice: 2800,
    images: [
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', alt: 'Silver Lion Ring', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 2800, stock: 25, sku: 'LR-925-005-S8', attributes: { size: '8', finish: 'Polished' } },
      { metal: '925 Silver', purity: '92.5', price: 2800, stock: 20, sku: 'LR-925-005-S9', attributes: { size: '9', finish: 'Polished' } },
      { metal: '925 Silver', purity: '92.5', price: 2800, stock: 18, sku: 'LR-925-005-S10', attributes: { size: '10', finish: 'Polished' } }
    ],
    featured: false, bestSeller: false, newArrival: true,
    artisan: 'Silversmith Guild, Jaipur'
  },
  {
    name: 'Custom Engraving Silver Bracelet',
    slug: 'custom-engraving-silver-bracelet',
    description: 'Personalizable 925 Sterling Silver bracelet with up to 30 characters of custom engraving. 8mm wide, 20cm length. Available in polished or matte finish. Delivered in a luxury gift box.',
    shortDescription: 'Personalized 925 Silver bracelet — up to 30 chars engraving.',
    category: 'Bracelets',
    subcategory: 'Custom',
    tags: ['Handcrafted', 'Customizable', 'Best Seller'],
    basePrice: 4500,
    images: [
      { url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800', alt: 'Silver Engraving Bracelet', isPrimary: true }
    ],
    variants: [
      { metal: '925 Silver', purity: '92.5', price: 4500, stock: 40, sku: 'CB-925-006-P', attributes: { finish: 'Polished' } },
      { metal: '925 Silver', purity: '92.5', price: 4700, stock: 30, sku: 'CB-925-006-M', attributes: { finish: 'Matte' } }
    ],
    featured: true, bestSeller: true, newArrival: false,
    artisan: 'Silverkaari Master Craftsmen'
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(products);
      logger.info(`Database seeded with ${products.length} products`);
    }

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists && process.env.ADMIN_EMAIL) {
      await User.create({
        name: 'Silverkaari Admin',
        email: process.env.ADMIN_EMAIL,
        password: 'Admin@2026#Secure',
        role: 'admin',
        isEmailVerified: true
      });
      logger.info(`Admin user created: ${process.env.ADMIN_EMAIL}`);
    }
  } catch (error) {
    logger.error('Seeding error:', error);
  }
};
