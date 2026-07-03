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
        <div className="hero-custom">
            <div className="hero-text">
                <h1>Crafting <strong>Stories</strong> in Silver</h1>
                <p>Since 1993, 92.5 sterling silver masterpieces — handcrafted, timeless, and rooted in India's heritage.</p>
                <Link to="/products" className="btn-custom">Explore Collection</Link>
            </div>
            <div className="hero-image">
                <span><FaRing style={{ marginRight: '12px', display: 'inline-block' }} /> 925 Silver Legacy</span>
            </div>
        </div>

        {/* new arrivals */}
        {(naLoading || newArrivals?.length > 0) && (
          <>
            <div className="section-title-custom"><span>New</span> Arrivals</div>
            <div className="product-grid-custom">
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
            <div className="section-title-custom"><span>Featured</span> Products</div>
            <div className="product-grid-custom">
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
            <div className="section-title-custom"><span>Best</span> Sellers</div>
            <div className="product-grid-custom">
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
                <h2><strong>Amrit Silver:</strong> Crafting Stories in Silver</h2>
                <p>Since 1993, Amrit Silver has crafted timeless 92.5 sterling silver pieces, blending tradition with modern elegance. Each handcrafted masterpiece celebrates India’s rich heritage.</p>
                <div className="legacy-icons">
                    <div><FaGem style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Pure 92.5 Silver</span></div>
                    <div><FaHands style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Handcrafted</span></div>
                    <div><FaOm style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Traditional Art</span></div>
                    <div><FaCalendarAlt style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>32 Years Legacy</span></div>
                    <div><FaTruck style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Free Shipping</span></div>
                    <div><FaGlobe style={{ fontSize: '28px', color: '#5a4a3a', marginBottom: '6px' }} /><span>Worldwide Shipping</span></div>
                </div>
            </div>
            <div style={{ fontSize: '64px', color: '#b8a088', opacity: 0.3 }}>
                <FaCrown />
            </div>
        </div>
      </div>

      <TestimonialSection />

    </>
  );
};

export default HomePage;
