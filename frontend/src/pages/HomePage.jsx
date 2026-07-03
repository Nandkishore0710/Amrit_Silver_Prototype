import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCcw } from 'react-icons/fi';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '../hooks/useProducts';
import { CATEGORIES } from '../utils/constants';
import { useInView } from 'react-intersection-observer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const heroSlides = [
  {
    title: 'Silver, Crafted\nfor Eternity',
    subtitle: 'Handcrafted 925 Sterling Silver pieces by India\'s master artisans',
    cta: 'Explore Collection',
    ctaLink: '/products',
    bg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600',
    tag: 'New Collection 2026'
  },
  {
    title: 'Divine Idols\nin Pure Silver',
    subtitle: 'Bring heritage home with handcrafted silver deity idols',
    cta: 'Shop Idols',
    ctaLink: '/products?category=Idols',
    bg: 'https://images.unsplash.com/photo-1567591570506-c01d1d2b1b12?w=1600',
    tag: 'Bestseller'
  },
  {
    title: 'Custom\nMobile Covers',
    subtitle: 'Your phone, dressed in pure silver — personalized for you',
    cta: 'Customize Now',
    ctaLink: '/products?category=Mobile+Covers',
    bg: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600',
    tag: 'Trending'
  }
];

const features = [
  { icon: FiStar, title: '925 Pure Silver', desc: 'Certified hallmarked silver in every piece' },
  { icon: FiShield, title: 'Lifetime Warranty', desc: '100% authenticity guaranteed with certificate' },
  { icon: FiTruck, title: 'Free Shipping', desc: 'Complimentary shipping on orders above ₹5000' },
  { icon: FiRefreshCcw, title: '30-Day Returns', desc: 'Hassle-free returns and exchanges' }
];

const Section = ({ children, className = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`section ${className}`}
    >
      {children}
    </motion.section>
  );
};

const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellers, isLoading: bsLoading } = useBestSellers();
  const { data: newArrivals, isLoading: naLoading } = useNewArrivals();

  return (
    <>
      <Helmet>
        <title>Silverkaari — Handcrafted Silver Excellence</title>
        <meta name="description" content="Explore handcrafted 925 Sterling Silver mobile covers, idols, jewelry and more from India's finest artisans." />
      </Helmet>

      {/* ─── Hero ─── */}
      <section className="relative h-[90vh] min-h-[560px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
                <div className="relative h-full">
                  <img src={slide.bg} alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-900/60 to-transparent" />
                  <div className="absolute inset-0 bg-hero-pattern" />
                  <div className="relative h-full page-container flex items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -40 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-xl"
                    >
                      <span className="badge-gold mb-4 inline-block">{slide.tag}</span>
                      <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-tight mb-4 whitespace-pre-line">
                        {slide.title.split('\n')[0]}
                        <span className="text-gold-gradient block">{slide.title.split('\n')[1]}</span>
                      </h1>
                      <p className="text-silver-300 text-lg mb-8 leading-relaxed">{slide.subtitle}</p>
                      <div className="flex gap-4 flex-wrap">
                        <Link to={slide.ctaLink} className="btn-primary text-base px-8 py-4">
                          {slide.cta} <FiArrowRight />
                        </Link>
                        <Link to="/products" className="btn-secondary text-base px-8 py-4">
                          View All
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-gold-400 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ─── Features strip ─── */}
      <section className="bg-dark-800/50 border-y border-white/[0.04] py-8">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-600/15 flex items-center justify-center shrink-0">
                  <f.icon className="text-gold-400" size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-silver-600 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <Section>
        <div className="page-container">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <div className="gold-divider mx-auto mb-4" />
            <p className="section-subtitle mx-auto">From divine idols to statement jewelry — discover our full collection</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.slice(0, 10).map((cat, i) => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat.id)}`}
                  className="flex flex-col items-center gap-3 p-4 card-hover text-center group"
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                  <span className="text-silver-300 group-hover:text-gold-400 text-sm font-medium transition-colors">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Featured ─── */}
      {(featuredLoading || featured?.length > 0) && (
        <Section className="bg-dark-800/30">
          <div className="page-container">
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Featured Pieces</h2>
                <div className="gold-divider mt-2" />
              </div>
              <Link to="/products?featured=true" className="btn-ghost text-sm hidden sm:flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredLoading
                ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : featured?.map(product => (
                  <motion.div key={product._id} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              }
            </div>
          </div>
        </Section>
      )}

      {/* ─── Best Sellers ─── */}
      {(bsLoading || bestSellers?.length > 0) && (
        <Section>
          <div className="page-container">
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <span className="badge-gold mb-2 inline-block">Most Loved</span>
                <h2 className="section-title">Best Sellers</h2>
                <div className="gold-divider mt-2" />
              </div>
              <Link to="/products?bestSeller=true" className="btn-ghost text-sm hidden sm:flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {bsLoading
                ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : bestSellers?.slice(0, 5).map(product => (
                  <motion.div key={product._id} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              }
            </div>
          </div>
        </Section>
      )}

      {/* ─── Heritage Banner ─── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=1600)' }}
        />
        <div className="absolute inset-0 bg-dark-950/75" />
        <div className="relative page-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge-gold mb-4 inline-block tracking-widest text-xs">500 YEAR HERITAGE</span>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-4 leading-tight">
              Where Ancient Craft<br />Meets Modern Design
            </h2>
            <div className="gold-divider mx-auto mb-6" />
            <p className="text-silver-300 text-lg max-w-2xl mx-auto mb-8">
              Every Silverkaari piece is handcrafted by artisans who have inherited their craft across generations.
              We bring their stories — and their masterpieces — to you.
            </p>
            <Link to="/products" className="btn-primary text-base px-8 py-4">
              Discover Our Story <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── New Arrivals ─── */}
      {(naLoading || newArrivals?.length > 0) && (
        <Section>
          <div className="page-container">
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <span className="bg-green-900/30 text-green-400 border border-green-700/20 badge mb-2 inline-block">Just In</span>
                <h2 className="section-title">New Arrivals</h2>
                <div className="gold-divider mt-2" />
              </div>
              <Link to="/products?newArrival=true" className="btn-ghost text-sm hidden sm:flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {naLoading
                ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : newArrivals?.slice(0, 8).map(product => (
                  <motion.div key={product._id} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              }
            </div>
          </div>
        </Section>
      )}

      {/* ─── CTA Banner ─── */}
      <section className="py-20 bg-gradient-to-r from-gold-900/30 via-dark-800 to-gold-900/30 border-y border-gold-900/20">
        <div className="page-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-silver-400 text-lg mb-8">
              Our artisans create fully custom pieces — just for you.
            </p>
            <Link to="/products?category=Custom" className="btn-primary text-base px-10 py-4">
              Request Custom Order <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
