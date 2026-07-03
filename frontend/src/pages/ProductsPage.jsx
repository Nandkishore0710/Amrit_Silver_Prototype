import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';
import clsx from 'clsx';

const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: '', max: '2000' },
  { label: '₹2,000 – ₹5,000', min: '2000', max: '5000' },
  { label: '₹5,000 – ₹15,000', min: '5000', max: '15000' },
  { label: '₹15,000 – ₹50,000', min: '15000', max: '50000' },
  { label: 'Above ₹50,000', min: '50000', max: '' }
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') || '';
  const bestSeller = searchParams.get('bestSeller') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const { data, isLoading, isFetching } = useProducts({
    category, search, sort, minPrice, maxPrice,
    featured, bestSeller, newArrival,
    page, limit: 20
  });

  const products = data?.data || [];
  const pagination = data?.pagination;
  const activeFilters = [category, search, minPrice || maxPrice, featured, bestSeller, newArrival].filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>{category ? `${category} — Silverkaari` : 'All Collections — Silverkaari'}</title>
        <meta name="description" content={`Browse ${category || 'all'} handcrafted silver products at Silverkaari.`} />
      </Helmet>

      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-white">
              {search ? `Results for "${search}"` : category || 'Our Collection'}
            </h1>
            {pagination && (
              <p className="text-silver-600 text-sm mt-1">{pagination.total} products</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="input text-sm pr-10 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 pointer-events-none" size={16} />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={clsx('btn-ghost px-4 py-2 gap-2 text-sm border border-white/10 rounded-xl',
                filtersOpen && 'border-gold-600/50 text-gold-400')}
            >
              <FiFilter size={16} />
              Filters {activeFilters > 0 && <span className="badge-gold ml-1">{activeFilters}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <motion.aside
            initial={false}
            animate={{ width: filtersOpen ? 240 : 0, opacity: filtersOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block overflow-hidden shrink-0"
          >
            {filtersOpen && (
              <div className="w-60 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Category</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => setParam('category', '')}
                      className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        !category ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5')}>
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setParam('category', cat.id)}
                        className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                          category === cat.id ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5')}>
                        <span>{cat.icon}</span>{cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => { setParam('minPrice', ''); setParam('maxPrice', ''); }}
                      className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        !minPrice && !maxPrice ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5')}>
                      All Prices
                    </button>
                    {PRICE_RANGES.map(range => (
                      <button key={range.label}
                        onClick={() => { setParam('minPrice', range.min); setParam('maxPrice', range.max); }}
                        className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          minPrice === range.min && maxPrice === range.max
                            ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5')}>
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Collections</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: 'featured', label: '⭐ Featured' },
                      { key: 'bestSeller', label: '🔥 Best Sellers' },
                      { key: 'newArrival', label: '✨ New Arrivals' }
                    ].map(({ key, label }) => (
                      <button key={key}
                        onClick={() => setParam(key, searchParams.get(key) ? '' : 'true')}
                        className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          searchParams.get(key) ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5')}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear all */}
                {activeFilters > 0 && (
                  <button onClick={() => setSearchParams(new URLSearchParams())}
                    className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-1">
                    <FiX size={14} /> Clear All Filters
                  </button>
                )}
              </div>
            )}
          </motion.aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl opacity-20 mb-4">🔍</div>
                <h3 className="font-serif text-2xl text-white mb-2">No products found</h3>
                <p className="text-silver-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={clsx('grid gap-4 md:gap-6',
                'grid-cols-2 md:grid-cols-3', filtersOpen ? '' : 'lg:grid-cols-4')}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => setParam('page', p.toString())}
                    className={clsx('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                      p === page ? 'bg-gold-600 text-white' : 'border border-white/10 text-silver-400 hover:border-gold-600/50 hover:text-gold-400')}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
