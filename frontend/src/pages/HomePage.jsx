import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const [activeTab, setActiveTab] = useState('hotshots');

  const categories = [
    { name: 'Royal Edition', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Royal', link: '/products?category=Royal Edition' },
    { name: 'Rudraksh Jewellery', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Rudraksh', link: '/products?category=Rudraksh Jewellery' },
    { name: 'Silver Idols', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Idols', link: '/products?category=Silver Idols' },
    { name: 'Traditional', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Traditional', link: '/products?category=Traditional' },
    { name: 'Stone Bracelet', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Bracelet', link: '/products?category=Stone Bracelet' },
    { name: 'Silver God Pendants', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Pendants', link: '/products?category=Silver God Pendants' },
    { name: 'Silver Rakhis', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Rakhis', link: '/products?category=Silver Rakhis' },
    { name: 'Silver Antiques', image: 'https://placehold.co/200x200/F7F7F7/1F1F1F?text=Antiques', link: '/products?category=Silver Antiques' }
  ];

  return (
    <>
      <Helmet>
        <title>SILVER PHONE COVER STORE - SILVERINE</title>
        <meta name="description" content="SILVERINE brings you premium handcrafted 92.5 sterling silver phone covers that combine luxury, durability, and timeless elegance." />
      </Helmet>

      {/* Hero Banner */}
      <section className="w-full relative bg-[#FAF7F1]">
        <Link to="/products">
          <picture>
            <source media="(min-width: 768px)" srcSet="/hero_banner.png" />
            <img 
              src="/hero_banner.png" 
              alt="Premium Silver Covers"
              className="w-full object-cover"
            />
          </picture>
        </Link>
      </section>

      {/* CATEGORIES Thumbnail Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-[1320px]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-[#1F1F1F] tracking-wide font-serif" style={{ fontFamily: 'var(--pls-primary-font)' }}>
              Explore Our Collection
            </h2>
          </div>
          
          <div className="flex justify-center gap-6 md:gap-10 overflow-x-auto categories-scroll pb-4">
            {categories.map((cat, i) => (
              <Link 
                to={cat.link} 
                key={i}
                className="flex-shrink-0 w-24 md:w-32 group text-center flex flex-col items-center"
              >
                <div className="rounded-full overflow-hidden mb-4 border-[1.5px] border-[#c8a97e] p-1 aspect-square mx-auto w-[90px] md:w-[130px] transition-all group-hover:shadow-md">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-[13px] text-[#4A4A4A] group-hover:text-[#1F1F1F] transition-colors leading-tight font-medium px-1">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What's New - Tabs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1320px]">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-bold text-[#1F1F1F] uppercase tracking-wide">
              <span className="inline-block w-8 h-[2px] bg-[#1F1F1F] align-middle mr-4"></span>
              What's New
              <span className="inline-block w-8 h-[2px] bg-[#1F1F1F] align-middle ml-4"></span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <button 
              className={`text-[16px] font-bold uppercase tracking-wide px-4 silverine-tab ${activeTab === 'hotshots' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotshots')}
            >
              HOTSHOTS
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredLoading 
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured?.slice(0, 8).map(product => (
                  <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Legacy Footer Banner Info */}
      <section className="py-20 border-t border-[#E9E9E9] bg-white">
        <div className="container mx-auto px-4 max-w-[1320px] text-center">
          <h2 className="text-3xl font-bold text-[#1F1F1F] mb-6">SILVERINE: Premium Silver Covers</h2>
          <p className="max-w-2xl mx-auto text-[#696C70] mb-10 text-[16px] leading-relaxed">
            Silverine brings you premium handcrafted 92.5 sterling silver phone covers that combine luxury, durability, and timeless elegance.
          </p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
