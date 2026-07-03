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
    <Link to={`/product/${product.slug}`} className={clsx('product-card-custom', className)}>
        <div className="product-image-custom">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
        </div>
        <div className="product-name-custom">
            {product.name}
        </div>
        <div className="product-price-custom">
            {formatCurrency(discountedPrice)}
            {hasDiscount && (
              <s>{formatCurrency(product.basePrice)}</s>
            )}
        </div>
        {hasDiscount && (
          <div><span className="product-badge-custom">Sale</span></div>
        )}
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="product-card-custom pointer-events-none">
    <div className="product-image-custom animate-pulse bg-stone-200" style={{ background: '#e5e5e5' }}></div>
    <div className="animate-pulse h-4 bg-stone-200 rounded w-full mb-2" style={{ background: '#e5e5e5' }}></div>
    <div className="animate-pulse h-4 bg-stone-200 rounded w-2/3" style={{ background: '#e5e5e5' }}></div>
  </div>
);

export default ProductCard;
