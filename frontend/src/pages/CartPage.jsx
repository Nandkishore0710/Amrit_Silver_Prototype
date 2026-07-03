import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/helpers';

const CartPage = () => {
  const { items, subtotal, tax, shippingCost, total, freeShippingRemaining, clear } = useCart();

  return (
    <>
      <Helmet>
        <title>Cart — Silverkaari</title>
      </Helmet>

      <div className="page-container py-10">
        <h1 className="font-serif text-4xl text-white mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl opacity-10 mb-6">🛒</div>
            <h2 className="font-serif text-3xl text-white mb-3">Your cart is empty</h2>
            <p className="text-silver-500 mb-8">Discover our handcrafted silver collection</p>
            <Link to="/products" className="btn-primary text-base px-8 py-4">Explore Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/[0.06]">
                  <span className="text-silver-400 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  <button onClick={clear} className="text-silver-600 hover:text-red-400 transition-colors text-sm flex items-center gap-1">
                    <FiTrash2 size={14} />Clear Cart
                  </button>
                </div>
                <AnimatePresence>
                  {items.map(item => (
                    <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h3 className="font-serif text-xl text-white mb-4">Order Summary</h3>

                {freeShippingRemaining > 0 && (
                  <div className="bg-gold-900/20 border border-gold-900/30 rounded-xl p-3 mb-4">
                    <p className="text-gold-400 text-xs">
                      Add {formatCurrency(freeShippingRemaining)} more for <strong>FREE shipping</strong>!
                    </p>
                    <div className="h-1 bg-dark-600 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-700 to-gold-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-silver-400">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-silver-400">
                    <span>Tax (18% GST)</span><span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-silver-400">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-400' : ''}>
                      {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-white font-bold text-base">
                    <span>Total</span><span className="text-gold-400">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link to="/checkout" id="checkout-btn" className="btn-primary w-full justify-center mb-3">
                  <FiShoppingBag size={18} />Proceed to Checkout
                </Link>
                <Link to="/products" className="btn-ghost w-full justify-center text-sm">
                  Continue Shopping
                </Link>

                {/* Trust */}
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <div className="flex items-center justify-center gap-2 text-silver-700 text-xs">
                    <span>🔒</span>
                    <span>Secure checkout · SSL encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
