import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b border-white/[0.06] last:border-0"
    >
      {/* Image */}
      <Link to={`/product/${item.slug}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl bg-dark-700"
          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.slug}`} className="block">
          <h4 className="text-white text-sm font-medium leading-tight hover:text-gold-400 transition-colors truncate">
            {item.name}
          </h4>
        </Link>
        {item.metal && (
          <p className="text-silver-600 text-xs mt-0.5">{item.metal}</p>
        )}
        {item.customization?.engraving && (
          <p className="text-silver-600 text-xs mt-0.5">Engraving: "{item.customization.engraving}"</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Decrease quantity"
            >
              <FiMinus size={14} />
            </button>
            <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-silver-400 hover:text-white hover:bg-white/5 transition-colors"
              disabled={item.quantity >= 10}
              aria-label="Increase quantity"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gold-400 font-semibold text-sm">
              {formatCurrency(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="text-silver-600 hover:text-red-400 transition-colors"
              aria-label="Remove item"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
