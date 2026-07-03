import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiPackage, FiStar, FiChevronRight } from 'react-icons/fi';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, getPrimaryImage, calcDiscount } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../api';
import clsx from 'clsx';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !product) return (
    <div className="min-h-[60vh] flex items-center justify-center text-center bg-white">
      <div>
        <h2 className="font-serif text-2xl text-[#1F1F1F] mb-2">Product Not Found</h2>
        <Link to="/products" className="btn-primary mt-4">Back to Collection</Link>
      </div>
    </div>
  );

  const variant = selectedVariant || product.variants?.[0];
  const price = variant?.price || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const finalPrice = hasDiscount ? product.salePrice : price;
  const primaryImg = getPrimaryImage(product.images);

  const handleAddToCart = () => {
    addItem(product, variant, quantity, engraving ? { engraving } : {});
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to save to wishlist'); return; }
    try {
      await api.post(`/users/me/wishlist/${product._id}`);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to leave a review'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  return (
    <>
      <Helmet>
        <title>{product.title} — Silverine</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
        <meta property="og:image" content={primaryImg} />
      </Helmet>

      <div className="page-container py-8 bg-white min-h-screen">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#c8a97e] transition-colors">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-[#c8a97e] transition-colors">Collection</Link>
          <FiChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-[#c8a97e] transition-colors">{product.category}</Link>
          <FiChevronRight size={14} />
          <span className="text-stone-800 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ─── Images ─── */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl bg-stone-50 aspect-square group border border-stone-100 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage]?.url || primaryImg}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded shadow-sm tracking-wider uppercase">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button key={i}
                    onClick={() => setSelectedImage(i)}
                    className={clsx('shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm',
                      i === selectedImage ? 'border-[#c8a97e]' : 'border-stone-200 hover:border-[#c8a97e]/50')}>
                    <img src={img.url} alt={product.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Details ─── */}
          <div className="space-y-6">
            {/* Category & badges */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{product.category}</span>
              {product.tags?.map(tag => <span key={tag} className="bg-[#c8a97e]/10 text-[#c8a97e] border border-[#c8a97e]/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{tag}</span>)}
            </div>

            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1F1F1F] font-bold leading-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>{product.title}</h1>

              {/* Rating */}
              {product.rating?.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} size={16}
                        className={i <= Math.round(product.rating.average) ? 'text-[#c8a97e] fill-[#c8a97e]' : 'text-stone-300'} />
                    ))}
                  </div>
                  <span className="text-[#c8a97e] font-bold">{product.rating.average}</span>
                  <span className="text-stone-500 text-sm font-medium">({product.rating.count} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-[#1F1F1F]">{formatCurrency(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-stone-400 line-through text-lg font-medium">{formatCurrency(product.price)}</span>
                  <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-xs font-bold uppercase">Save {formatCurrency(product.price - finalPrice)}</span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Select Variant
                  {variant && <span className="text-[#c8a97e] ml-2">{variant.metal} — {variant.attributes?.finish}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx('px-4 py-2 rounded text-sm font-bold uppercase transition-all shadow-sm border',
                        variant?._id === v._id || (!selectedVariant && i === 0)
                          ? 'border-[#1F1F1F] bg-[#1F1F1F] text-white'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white')}>
                      {v.model}
                    </button>
                  ))}
                </div>
                {variant?.stock > 0 && variant?.stock <= 5 && (
                  <p className="text-red-500 text-xs mt-2 font-medium">⚠️ Only {variant.stock} left in stock!</p>
                )}
              </div>
            )}

            {/* Engraving */}
            {product.tags?.includes('Customizable') && (
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Custom Engraving (optional, max 30 characters)</label>
                <input
                  type="text"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, 30))}
                  placeholder="e.g. John & Sarah ♥"
                  className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none transition-all shadow-sm"
                />
                <p className="text-stone-500 text-xs mt-1 font-medium">{engraving.length}/30 characters</p>
              </div>
            )}

            {/* Quantity & Cart */}
            <div className="flex gap-3">
              <div className="flex items-center border border-stone-200 rounded shadow-sm bg-white overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-stone-500 hover:text-[#1F1F1F] hover:bg-stone-50 text-xl font-medium transition-colors">−</button>
                <span className="w-10 text-center text-[#1F1F1F] font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-12 h-12 flex items-center justify-center text-stone-500 hover:text-[#1F1F1F] hover:bg-stone-50 text-xl font-medium transition-colors">+</button>
              </div>

              <button
                id="add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={variant?.stock === 0}
                className="flex-1 bg-black text-white hover:bg-[#c8a97e] font-bold uppercase tracking-wider transition-colors py-3 px-6 rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={18} />
                {variant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={clsx('w-12 h-12 rounded border flex items-center justify-center transition-all shadow-sm',
                  wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-stone-200 bg-white text-stone-400 hover:border-red-300 hover:text-red-400')}
                aria-label="Add to wishlist"
              >
                <FiHeart size={20} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Artisan info */}
            {(product.artisan || product.heritage) && (
              <div className="p-4 bg-stone-50 rounded border border-stone-200">
                {product.artisan && <p className="text-[#1F1F1F] text-sm font-bold mb-1">✋ {product.artisan}</p>}
                {product.heritage && <p className="text-stone-600 text-sm leading-relaxed">{product.heritage}</p>}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🔐', label: '925 Certified' },
                { icon: '📦', label: 'Free shipping ₹5000+' },
                { icon: '🔄', label: '30-day returns' }
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-1.5 p-3 bg-stone-50 border border-stone-100 rounded shadow-sm text-center">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-stone-600 text-xs font-medium uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-stone-200 mb-8">
            {['description', 'reviews', 'details'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx('px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-[#1F1F1F] text-[#1F1F1F]'
                    : 'border-transparent text-stone-500 hover:text-[#1F1F1F]')}>
                {tab} {tab === 'reviews' && product.rating?.count > 0 && `(${product.rating.count})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'description' && (
                <div className="prose max-w-none text-stone-700 leading-relaxed whitespace-pre-line text-lg font-medium">
                  {product.description}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Category', value: product.category },
                    { label: 'Stock', value: product.stock }
                  ].map(({ label, value }) => value && (
                    <div key={label} className="p-4 bg-stone-50 border border-stone-200 rounded">
                      <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-[#1F1F1F] text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Review form */}
                  <div className="card p-6 bg-stone-50 border border-stone-200 shadow-sm rounded-lg">
                    <h3 className="font-serif text-xl text-[#1F1F1F] mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Your Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(r => (
                            <button key={r} type="button"
                              onClick={() => setReviewForm(f => ({ ...f, rating: r }))}
                              className={clsx('text-2xl transition-transform hover:scale-110',
                                r <= reviewForm.rating ? 'text-[#c8a97e]' : 'text-stone-300')}>
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Your Review</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          rows={4}
                          placeholder="Share your experience with this product..."
                          className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none transition-all resize-none shadow-sm"
                          maxLength={500}
                        />
                      </div>
                      <button type="submit" disabled={submittingReview} className="bg-black text-white hover:bg-[#c8a97e] font-bold uppercase tracking-wider transition-colors py-3 px-6 rounded shadow-lg disabled:opacity-50">
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {/* Reviews list */}
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="card p-5 bg-stone-50 border border-stone-200 rounded-lg shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#c8a97e] flex items-center justify-center text-white text-sm font-bold">
                                {review.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="text-[#1F1F1F] text-sm font-bold">{review.name || 'User'}</p>
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(r => (
                                    <span key={r} className={r <= review.rating ? 'text-[#c8a97e] text-xs' : 'text-stone-300 text-xs'}>★</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {review.verified && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Verified Purchase</span>}
                          </div>
                          {review.comment && <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-silver-600 text-center py-8">No reviews yet. Be the first!</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related?.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl text-[#1F1F1F] mb-8 font-bold" style={{ fontFamily: 'Georgia, serif' }}>You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {related.slice(0, 6).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
