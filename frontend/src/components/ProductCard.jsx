import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, getPrimaryImage, calcDiscount } from '../utils/helpers';
import clsx from 'clsx';

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();
  const primaryImage = getPrimaryImage(product?.images);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice : product.price;

  return (
    <Link to={`/product/${product.slug}`} className={clsx('silverine-card', className)}>
        <div className="img-placeholder">
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          {product.featured && (
            <span className="hot">Featured</span>
          )}
        </div>
        <div className="product-title">
            {product.title}
        </div>
        <div className="product-price">
            {formatCurrency(displayPrice)}
            {hasDiscount && (
              <s>{formatCurrency(product.price)}</s>
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
