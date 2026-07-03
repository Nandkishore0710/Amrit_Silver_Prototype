import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const [activeTab, setActiveTab] = useState('hotshots');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1920&auto=format&fit=crop', bg: 'bg-[#1a1a1a]' },
    { image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=1920&auto=format&fit=crop', bg: 'bg-[#2b2b2b]' },
    { image: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=1920&auto=format&fit=crop', bg: 'bg-[#333333]' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);
  const categories = [
    { name: 'Divine Lords', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=200&auto=format&fit=crop', link: '/products?category=Divine Lords' },
    { name: 'Raj Gharana', image: 'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=200&auto=format&fit=crop', link: '/products?category=Raj Gharana' },
    { name: 'Name and Logo', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=200&auto=format&fit=crop', link: '/products?category=Name and Logo' },
    { name: 'Flower Bloom', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=200&auto=format&fit=crop', link: '/products?category=Flower Bloom' },
    { name: 'Spirit Animals', image: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=200&auto=format&fit=crop', link: '/products?category=Spirit Animals' },
    { name: 'Custom Designs', image: 'https://images.unsplash.com/photo-1542451313056-b7c8e6266459?q=80&w=200&auto=format&fit=crop', link: '/products?category=Custom Designs' }
  ];

  return (
    <>
      <Helmet>
        <title>AMRIT SILVER - PREMIUM SILVER PHONE COVERS</title>
        <meta name="description" content="Amrit Silver brings you premium handcrafted 92.5 sterling silver phone covers that combine luxury, durability, and timeless elegance." />
      </Helmet>

      {/* Hero Banner Section (Auto-Rotating Slider) */}
      <section className={`w-full relative ${heroSlides[currentSlide].bg} text-white overflow-hidden group transition-colors duration-1000`}>
        
        {/* Background Images with Smooth Crossfade */}
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out mix-blend-overlay ${currentSlide === index ? 'opacity-60' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
        ))}
        
        {/* Slider Controls */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1F1F1F] opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1F1F1F] opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <div className="container mx-auto px-4 relative z-10 py-24 md:py-32 flex flex-col items-center text-center">
          
          <h2 className="text-6xl md:text-8xl font-bold mb-4 font-serif text-white tracking-wide" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
            Amrit Silver
          </h2>
          
          <h3 className="text-2xl md:text-4xl font-serif mb-6 text-white" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
            Where Protection Meets Pure Prestige.
          </h3>
          
          <p className="text-lg md:text-xl font-serif text-white mb-10 max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
            Get Your First Amrit Silver Phone Cover and Step Into Luxury.
          </p>
          
          <Link to="/products" className="inline-flex items-center gap-3 bg-[#E8A317] hover:bg-[#D49315] text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wider transition-colors shadow-lg">
            SHOP NOW
            <span className="bg-white text-[#E8A317] rounded-full p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
            </span>
          </Link>
          
          <div className="mt-16 text-sm font-medium text-white/80 tracking-widest uppercase">
            www.amritsilver.in
          </div>
        </div>
      </section>

      {/* Filter Toggles (Best Seller / On Sale) */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto flex justify-center gap-4">
          <Link to="/products?sort=popular" className="px-8 py-3 bg-white border border-gray-200 shadow-sm rounded-lg text-lg font-bold text-[#1F1F1F] hover:bg-gray-50 transition-colors min-w-[160px] text-center">
            Best Seller
          </Link>
          <Link to="/products?sale=true" className="px-8 py-3 bg-[#F5F5F5] border border-transparent rounded-lg text-lg font-bold text-[#1F1F1F] hover:bg-[#EAEAEA] transition-colors min-w-[160px] text-center">
            On Sale
          </Link>
        </div>
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
          <h2 className="text-3xl font-bold text-[#1F1F1F] mb-6">AMRIT SILVER: Premium Silver Covers</h2>
          <p className="max-w-2xl mx-auto text-[#696C70] mb-10 text-[16px] leading-relaxed">
            Amrit Silver brings you premium handcrafted 92.5 sterling silver phone covers that combine luxury, durability, and timeless elegance.
          </p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
