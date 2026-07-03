import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { formatCurrency, getPrimaryImage, calcDiscount } from '../utils/helpers';
import clsx from 'clsx';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={clsx('text-xs', i <= Math.round(rating) ? 'text-gold-400' : 'text-silver-800')}>★</span>
    ))}
    {count !== undefined && <span className="text-silver-600 text-xs ml-1">({count})</span>}
  </div>
);

const ProductCard = ({ product, className = '' }) => {
  const { addItem } = useCart();
  const primaryImage = getPrimaryImage(product.images);
  const hasDiscount = product.discount?.percentage && new Date(product.discount.validUntil) > new Date();
  const discountedPrice = hasDiscount
    ? product.basePrice * (1 - product.discount.percentage / 100)
    : product.basePrice;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, null, 1);
  };

  return (
    <motion.div
      className={clsx('group card-hover cursor-pointer', className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="product-img-wrapper">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="badge-danger text-[10px] font-bold px-2 py-0.5">
                {calcDiscount(product.basePrice, discountedPrice)}% OFF
              </span>
            )}
            {product.tags?.includes('Limited Edition') && (
              <span className="badge-gold text-[10px] px-2 py-0.5">Limited</span>
            )}
            {product.tags?.includes('New Arrival') && (
              <span className="bg-green-900/80 text-green-400 border border-green-700/30 badge text-[10px] px-2 py-0.5">New</span>
            )}
          </div>

          {/* Quick action overlay */}
          <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
            <button
              id={`add-to-cart-${product._id}`}
              onClick={handleAddToCart}
              className="btn-primary text-xs py-2 px-4 shadow-gold"
              aria-label="Add to cart"
            >
              <FiShoppingCart size={14} />
              Add to Cart
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="btn-secondary text-xs py-2 px-3"
              aria-label="View product"
            >
              <FiEye size={14} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-silver-500 text-xs uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-gold-300 transition-colors">
            {product.name}
          </h3>

          {product.rating?.count > 0 && (
            <div className="mb-2">
              <StarRating rating={product.rating.average} count={product.rating.count} />
            </div>
          )}

          {/* Artisan info */}
          {product.artisan && (
            <p className="text-silver-700 text-xs mb-2">By {product.artisan}</p>
          )}

          {/* Price */}
          <div className="flex items-end gap-2 mt-auto">
            <span className="price-current">{formatCurrency(discountedPrice)}</span>
            {hasDiscount && (
              <span className="price-original">{formatCurrency(product.basePrice)}</span>
            )}
          </div>

          {/* Variant metals */}
          {product.variants?.length > 1 && (
            <div className="flex gap-1 mt-2">
              {[...new Set(product.variants.map(v => v.metal))].slice(0, 3).map(metal => (
                <span key={metal} className="text-[10px] text-silver-600 border border-white/10 px-1.5 py-0.5 rounded">
                  {metal.split(' ')[0]}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-5 w-24 rounded mt-3" />
    </div>
  </div>
);

export default ProductCard;
