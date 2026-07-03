import Product from '../models/Product.js';
import User from '../models/User.js';
import { logger } from './logger.js';

const products = [
  {
    title: 'Hanuman Gada Brass Mobile Case',
    slug: 'hanuman-gada-brass-mobile-case',
    description: 'Handcrafted brass mobile case featuring Lord Hanuman\'s Gada in intricate relief work.',
    category: 'Mobile Covers',
    price: 18000,
    salePrice: 4800,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    stock: 20,
    featured: true,
    variants: [{ model: 'iPhone 15' }, { model: 'Samsung S24' }]
  },
  {
    title: 'Horse Engraved 925 Silver Mobile Cover',
    slug: 'horse-engraved-925-silver-mobile-cover',
    description: 'Sterling silver mobile cover with hand-engraved running horse motif.',
    category: 'Mobile Covers',
    price: 18000,
    salePrice: 13197,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    model3d: 'https://sketchfab.com/models/97b77b05e4754b8a9e671ea0d9c7843d/embed',
    stock: 15,
    featured: true,
    variants: [{ model: 'iPhone 15 Pro Max' }]
  },
  {
    title: 'Ram Hanuman Silver Mobile Cover – Limited',
    slug: 'ram-hanuman-silver-mobile-cover',
    description: 'Premium Silver cover featuring Lord Ram and Hanuman.',
    category: 'Mobile Covers',
    price: 18000,
    salePrice: 13197,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    stock: 10,
    featured: false,
    variants: [{ model: 'iPhone 14' }]
  }
];

export const seedDatabase = async () => {
  try {
    // Clear old products to apply new schema
    await Product.deleteMany({});
    
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
