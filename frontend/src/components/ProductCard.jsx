import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, getPrimaryImage, calcDiscount } from '../utils/helpers';
import clsx from 'clsx';

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();
  const primaryImage = getPrimaryImage(product.images);
  const hasDiscount = product.discount?.percentage && new Date(product.discount.validUntil) > new Date();
  const discountedPrice = hasDiscount
    ? product.basePrice * (1 - product.discount.percentage / 100)
    : product.basePrice;

  return (
    <Link to={`/product/${product.slug}`} className={clsx('silverine-card', className)}>
        <div className="img-placeholder">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          {product.tags?.includes('Limited Edition') && (
            <span className="hot">Limited</span>
          )}
        </div>
        <div className="product-title">
            {product.name}
        </div>
        <div className="product-price">
            {formatCurrency(discountedPrice)}
            {hasDiscount && (
              <s>{formatCurrency(product.basePrice)}</s>
            )}
        </div>
        {hasDiscount && (
          <div><span className="sale-flag">Sale</span></div>
        )}
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="silverine-card pointer-events-none">
    <div className="img-placeholder animate-pulse bg-stone-200" style={{ background: '#e5e5e5' }}></div>
    <div className="animate-pulse h-4 bg-stone-200 rounded w-full mb-2" style={{ background: '#e5e5e5' }}></div>
    <div className="animate-pulse h-4 bg-stone-200 rounded w-2/3" style={{ background: '#e5e5e5' }}></div>
  </div>
);

export default ProductCard;
