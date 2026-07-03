import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTruck, FiStar } from 'react-icons/fi';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import TestimonialSection from '../components/TestimonialSection';

const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <>
      <Helmet>
        <title>Silverine | Premium Handcrafted Silver</title>
        <meta name="description" content="Discover exquisite handcrafted silver phone covers and accessories." />
      </Helmet>

      {/* Hero Section with Glassmorphism & Gradient Blobs */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark-900 pt-20">
        {/* Animated background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-silver-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-md"
            >
              <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase">Redefining Luxury</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 drop-shadow-2xl"
            >
              Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-400 italic pr-2">Stories</span> <br /> in Silver.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-silver-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Elevate your everyday carry with bespoke, artisan-crafted silver phone covers that blend heritage artistry with modern elegance.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/products" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-dark-900 font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Pills */}
      <section className="py-12 bg-dark-950 border-b border-white/[0.05]">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 items-center justify-center min-w-max">
            {['iPhone 15 Pro', 'iPhone 14 Pro Max', 'Samsung S24 Ultra', 'Vintage Collection', 'Limited Editions'].map((cat, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-6 py-2.5 rounded-full border border-white/10 bg-dark-800 text-silver-300 hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all cursor-pointer font-medium"
              >
                {cat}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection with Staggered Animations */}
      <section className="py-24 bg-dark-950 relative">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Curated Signatures</h2>
              <p className="text-silver-400 max-w-md">Our most coveted pieces, handcrafted for those who appreciate the extraordinary.</p>
            </motion.div>
            <Link to="/products" className="text-gold-400 hover:text-gold-300 flex items-center gap-2 font-medium group transition-colors">
              View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {(featuredLoading || featured?.length > 0) && (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredLoading
                ? Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-dark-800 rounded-3xl aspect-[4/5]"></div>)
                : featured?.map(product => (
                  <motion.div key={product._id} variants={fadeInUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              }
            </motion.div>
          )}
        </div>
      </section>

      {/* Features/Trust Section (Glassmorphism) */}
      <section className="py-24 relative overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: FiShield, title: 'Authentic 925 Silver', desc: 'Certified pure sterling silver, crafted to last a lifetime.' },
              { icon: FiTruck, title: 'Global Delivery', desc: 'Insured, premium shipping across the globe directly to your door.' },
              { icon: FiStar, title: 'Master Craftsmanship', desc: 'Each piece takes 12+ hours of meticulous hand-engraving.' }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-10 rounded-3xl hover:bg-white/[0.05] hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500/20 to-transparent rounded-2xl flex items-center justify-center text-gold-400 mb-6 border border-gold-500/20">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3">{feature.title}</h3>
                <p className="text-silver-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TestimonialSection />
    </>
  );
};

export default HomePage;
