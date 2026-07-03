import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import CartItem from './CartItem';
import { formatCurrency } from '../utils/helpers';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, subtotal, tax, shippingCost, total, freeShippingRemaining, clear } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-dark-800 border-l border-white/[0.06] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-gold-400" size={20} />
                <h2 className="font-serif text-xl text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="badge-gold">{items.length}</span>
                )}
              </div>
              <button onClick={onClose} className="btn-ghost p-2" aria-label="Close cart">
                <FiX size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && freeShippingRemaining > 0 && (
              <div className="px-5 py-3 bg-dark-700/50">
                <p className="text-silver-500 text-xs mb-1.5">
                  Add <span className="text-gold-400 font-medium">{formatCurrency(freeShippingRemaining)}</span> more for FREE shipping!
                </p>
                <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            )}
            {items.length > 0 && freeShippingRemaining === 0 && (
              <div className="px-5 py-2.5 bg-green-900/20 border-b border-green-800/20">
                <p className="text-green-400 text-xs">🎉 You've unlocked FREE shipping!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="text-6xl opacity-20">🛒</div>
                  <p className="text-silver-500 font-serif text-lg">Your cart is empty</p>
                  <p className="text-silver-700 text-sm">Discover our handcrafted silver collection</p>
                  <Link to="/products" onClick={onClose} className="btn-primary mt-2">
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/[0.06] p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-silver-500">
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-silver-500">
                    <span>Tax (18% GST)</span><span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-silver-500">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-400' : ''}>
                      {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-white/10">
                    <span>Total</span><span className="text-gold-400">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn-primary w-full justify-center"
                    id="proceed-to-checkout"
                  >
                    Proceed to Checkout <FiArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => { clear(); }}
                    className="w-full text-xs text-silver-700 hover:text-red-400 transition-colors py-1"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
