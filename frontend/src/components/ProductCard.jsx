import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency, getPrimaryImage, calcDiscount } from '../utils/helpers';
import clsx from 'clsx';
import { FiHeart, FiBarChart2, FiEye, FiShoppingBag } from 'react-icons/fi';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, className = '' }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const primaryImage = getPrimaryImage(product?.images);
  let hoverImage = primaryImage;
  if (product?.images?.length > 1) {
    const img2 = product.images[1];
    hoverImage = typeof img2 === 'string' ? img2 : img2.url;
  }
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const discountPercent = hasDiscount ? calcDiscount(product.price, product.salePrice) : 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    dispatch(toggleWishlistItem(product));
    if (isWishlisted) {
      toast.success('Removed from wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className={clsx('relative flex flex-col group', className)}>
      <div className="silverine-product-image-container mb-4">
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 bg-white text-danger text-[10px] uppercase font-bold px-2 py-1 rounded-sm shadow-sm">
            Sale
          </div>
        )}
        
        <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-[#f7f7f7] overflow-hidden">
          <img
            src={primaryImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={`${product.title} hover`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>

        {/* Floating Icons */}
        <div className="silverine-action-icons">
          <button 
            className="silverine-icon-btn" 
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistToggle}
          >
            <FiHeart size={16} fill={isWishlisted ? "#e3342f" : "none"} color={isWishlisted ? "#e3342f" : "currentColor"} />
          </button>
          <button className="silverine-icon-btn" title="Compare">
            <FiBarChart2 size={16} />
          </button>
          <button className="silverine-icon-btn" title="Quick View">
            <FiEye size={16} />
          </button>
        </div>

        {/* Marquee Animation on Hover */}
        {hasDiscount && (
          <div className="silverine-marquee">
            <div className="silverine-marquee-items">
              {Array(6).fill(0).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="silverine-marquee-item">
                    Hot sale <span className="on-sale">{discountPercent}%</span> off
                  </div>
                  <div className="text-gray-300 mx-2">•</div>
                </React.Fragment>
              ))}
            </div>
            <div className="silverine-marquee-items" aria-hidden="true">
              {Array(6).fill(0).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="silverine-marquee-item">
                    Hot sale <span className="on-sale">{discountPercent}%</span> off
                  </div>
                  <div className="text-gray-300 mx-2">•</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col text-center px-2">
        <Link to={`/product/${product.slug}`} className="text-[13px] font-semibold text-[#1F1F1F] uppercase tracking-wide hover:text-black mb-1 line-clamp-1">
          {product.title}
        </Link>
        <div className="flex items-center justify-center gap-2 text-[14px]">
          {hasDiscount ? (
            <>
              <span className="text-[#696C70] font-medium">{formatCurrency(displayPrice)}</span>
              <s className="text-[#A1A1A1] text-[13px]">{formatCurrency(product.price)}</s>
              <span className="text-danger font-medium text-[13px]">-{discountPercent}%</span>
            </>
          ) : (
            <span className="text-[#1F1F1F] font-medium">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="flex flex-col pointer-events-none">
    <div className="aspect-[3/4] bg-[#f2f2f2] rounded-md animate-pulse mb-4"></div>
    <div className="h-4 bg-[#f2f2f2] rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
    <div className="h-4 bg-[#f2f2f2] rounded w-1/2 mx-auto animate-pulse"></div>
  </div>
);

export default ProductCard;
