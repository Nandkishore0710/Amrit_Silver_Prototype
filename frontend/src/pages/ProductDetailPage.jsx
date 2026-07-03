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
    <div className="min-h-[60vh] flex items-center justify-center text-center">
      <div>
        <h2 className="font-serif text-2xl text-white mb-2">Product Not Found</h2>
        <Link to="/products" className="btn-primary mt-4">Back to Collection</Link>
      </div>
    </div>
  );

  const variant = selectedVariant || product.variants?.[0];
  const price = variant?.discountPrice || variant?.price || product.basePrice;
  const hasDiscount = product.discount?.percentage && new Date(product.discount.validUntil) > new Date();
  const finalPrice = hasDiscount ? product.basePrice * (1 - product.discount.percentage / 100) : price;
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
        <title>{product.name} — Silverkaari</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 160)} />
        <meta property="og:image" content={primaryImg} />
      </Helmet>

      <div className="page-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-silver-600 mb-6">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-gold-400 transition-colors">Collection</Link>
          <FiChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-gold-400 transition-colors">{product.category}</Link>
          <FiChevronRight size={14} />
          <span className="text-silver-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ─── Images ─── */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl bg-dark-800 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage]?.url || primaryImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {hasDiscount && (
                <div className="absolute top-4 left-4 badge-danger px-3 py-1 text-sm font-bold">
                  {calcDiscount(product.basePrice, finalPrice)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button key={i}
                    onClick={() => setSelectedImage(i)}
                    className={clsx('shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                      i === selectedImage ? 'border-gold-500' : 'border-white/10 hover:border-white/30')}>
                    <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Details ─── */}
          <div className="space-y-6">
            {/* Category & badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-silver">{product.category}</span>
              {product.tags?.map(tag => <span key={tag} className="badge-gold">{tag}</span>)}
            </div>

            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-3">{product.name}</h1>

              {/* Rating */}
              {product.rating?.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} size={16}
                        className={i <= Math.round(product.rating.average) ? 'text-gold-400 fill-gold-400' : 'text-silver-700'} />
                    ))}
                  </div>
                  <span className="text-gold-400 font-semibold">{product.rating.average}</span>
                  <span className="text-silver-600 text-sm">({product.rating.count} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gold-400">{formatCurrency(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-silver-600 line-through text-lg">{formatCurrency(product.basePrice)}</span>
                  <span className="badge-danger">Save {formatCurrency(product.basePrice - finalPrice)}</span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div>
                <label className="input-label">
                  Select Variant
                  {variant && <span className="text-gold-400 ml-2">{variant.metal} — {variant.attributes?.finish}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                        variant?._id === v._id || (!selectedVariant && i === 0)
                          ? 'border-gold-500 bg-gold-600/15 text-gold-400'
                          : 'border-white/10 text-silver-400 hover:border-white/30',
                        v.stock === 0 && 'opacity-40 cursor-not-allowed line-through')}>
                      {v.metal} {v.attributes?.finish && `· ${v.attributes.finish}`}
                      {v.attributes?.size && ` · Size ${v.attributes.size}`}
                    </button>
                  ))}
                </div>
                {variant?.stock > 0 && variant?.stock <= 5 && (
                  <p className="text-amber-400 text-xs mt-2">⚠️ Only {variant.stock} left in stock!</p>
                )}
              </div>
            )}

            {/* Engraving */}
            {product.tags?.includes('Customizable') && (
              <div>
                <label className="input-label">Custom Engraving (optional, max 30 characters)</label>
                <input
                  type="text"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, 30))}
                  placeholder="e.g. John & Sarah ♥"
                  className="input text-sm"
                />
                <p className="text-silver-700 text-xs mt-1">{engraving.length}/30 characters</p>
              </div>
            )}

            {/* Quantity & Cart */}
            <div className="flex gap-3">
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-silver-400 hover:text-white hover:bg-white/5 text-lg font-medium">−</button>
                <span className="w-10 text-center text-white font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-11 h-12 flex items-center justify-center text-silver-400 hover:text-white hover:bg-white/5 text-lg font-medium">+</button>
              </div>

              <button
                id="add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={variant?.stock === 0}
                className="flex-1 btn-primary py-3"
              >
                <FiShoppingCart size={18} />
                {variant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={clsx('w-12 h-12 rounded-xl border flex items-center justify-center transition-all',
                  wishlisted ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 text-silver-400 hover:border-red-400/50 hover:text-red-400')}
                aria-label="Add to wishlist"
              >
                <FiHeart size={18} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Artisan info */}
            {(product.artisan || product.heritage) && (
              <div className="p-4 bg-dark-700/50 rounded-xl border border-white/[0.04]">
                {product.artisan && <p className="text-white text-sm font-medium mb-1">✋ {product.artisan}</p>}
                {product.heritage && <p className="text-silver-500 text-xs leading-relaxed">{product.heritage}</p>}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🔐', label: '925 Certified' },
                { icon: '📦', label: 'Free shipping ₹5000+' },
                { icon: '🔄', label: '30-day returns' }
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 bg-dark-700/30 rounded-xl text-center">
                  <span className="text-xl">{icon}</span>
                  <span className="text-silver-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-white/[0.06] mb-8">
            {['description', 'reviews', 'details'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx('px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-gold-500 text-gold-400'
                    : 'border-transparent text-silver-500 hover:text-white')}>
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
                <div className="prose prose-invert max-w-none text-silver-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Category', value: product.category },
                    { label: 'Metal', value: variant?.metal },
                    { label: 'Purity', value: variant?.purity ? `${variant.purity}%` : '-' },
                    { label: 'Weight', value: variant?.weight ? `${variant.weight}g` : '-' },
                    { label: 'Finish', value: variant?.attributes?.finish || '-' },
                    { label: 'SKU', value: variant?.sku || '-' }
                  ].map(({ label, value }) => value && (
                    <div key={label} className="p-4 bg-dark-700/30 rounded-xl">
                      <p className="text-silver-600 text-xs uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Review form */}
                  <div className="card p-6">
                    <h3 className="font-serif text-xl text-white mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="input-label">Your Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(r => (
                            <button key={r} type="button"
                              onClick={() => setReviewForm(f => ({ ...f, rating: r }))}
                              className={clsx('text-2xl transition-transform hover:scale-110',
                                r <= reviewForm.rating ? 'text-gold-400' : 'text-silver-800')}>
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="input-label">Your Review</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          rows={4}
                          placeholder="Share your experience with this product..."
                          className="input resize-none"
                          maxLength={500}
                        />
                      </div>
                      <button type="submit" disabled={submittingReview} className="btn-primary">
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {/* Reviews list */}
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="card p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gold-700 flex items-center justify-center text-white text-sm font-bold">
                                {review.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{review.name || 'User'}</p>
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(r => (
                                    <span key={r} className={r <= review.rating ? 'text-gold-400 text-xs' : 'text-silver-800 text-xs'}>★</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {review.verified && <span className="badge-success text-xs">Verified Purchase</span>}
                          </div>
                          {review.comment && <p className="text-silver-400 text-sm leading-relaxed">{review.comment}</p>}
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
            <h2 className="font-serif text-3xl text-white mb-8">You May Also Like</h2>
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

// Need to add clsx import
import clsx from 'clsx';
export default ProductDetailPage;
