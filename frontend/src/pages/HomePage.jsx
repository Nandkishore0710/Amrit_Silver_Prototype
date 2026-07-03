import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '../hooks/useProducts';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import TestimonialSection from '../components/TestimonialSection';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { FaGem, FaHands, FaOm, FaCalendarAlt, FaTruck, FaGlobe, FaCrown, FaRing } from 'react-icons/fa';

const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellers, isLoading: bsLoading } = useBestSellers();
  const { data: newArrivals, isLoading: naLoading } = useNewArrivals();

  return (
    <>
      <Helmet>
        <title>Amrit Silver | Redefining Silver Artistry</title>
        <meta name="description" content="Since 1993, 92.5 sterling silver masterpieces — handcrafted, timeless, and rooted in India's heritage." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* hero */}
        <div className="silverine-banner">
            <div>
                <h2>Crafting <strong>Stories</strong> in Silver</h2>
                <p className="tagline">Premium 92.5 sterling silver phone covers and accessories.</p>
            </div>
            <div>
                <Link to="/products" className="silverine-badge">Shop Collection</Link>
            </div>
        </div>

        {/* new arrivals */}
        {(naLoading || newArrivals?.length > 0) && (
          <>
            <div className="silverine-cats"><span>New Arrivals</span></div>
            <div className="silverine-grid">
                {naLoading
                  ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                  : newArrivals?.slice(0, 16).map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                }
            </div>
          </>
        )}

        {/* featured products */}
        {(featuredLoading || featured?.length > 0) && (
          <>
            <div className="silverine-cats"><span>Featured Products</span></div>
            <div className="silverine-grid">
                {featuredLoading
                  ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                  : featured?.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                }
            </div>
          </>
        )}

        {/* best sellers */}
        {(bsLoading || bestSellers?.length > 0) && (
          <>
            <div className="silverine-cats"><span>Best Sellers</span></div>
            <div className="silverine-grid">
                {bsLoading
                  ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                  : bestSellers?.slice(0, 14).map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                }
            </div>
          </>
        )}

        {/* legacy */}
        <div className="legacy-section">
            <div className="legacy-text">
                <h2><strong>Silverine:</strong> Premium Silver Covers</h2>
                <p>Silverine crafts premium 92.5 sterling silver phone covers and accessories, blending tradition with modern elegance.</p>
                <div className="legacy-icons">
                    <div><FaGem style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Pure 92.5 Silver</span></div>
                    <div><FaTruck style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Free Shipping</span></div>
                    <div><FaGlobe style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Worldwide Shipping</span></div>
                </div>
            </div>
        </div>
      </div>

      <TestimonialSection />

    </>
  );
};

export default HomePage;
