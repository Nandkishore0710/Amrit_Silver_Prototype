import { createSlice } from '@reduxjs/toolkit';
import { ls } from '../../utils/helpers';
import toast from 'react-hot-toast';

const loadCart = () => {
  const items = ls.get('sk_cart') || [];
  return items.filter(item => typeof item.price === 'number' && !isNaN(item.price));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    isOpen: false
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, variant, quantity = 1, customization } = action.payload;
      const variantId = variant?._id || 'default';
      const existingIdx = state.items.findIndex(
        item => item.productId === product._id && item.variantId === variantId
      );

      if (existingIdx >= 0) {
        state.items[existingIdx].quantity = Math.min(
          state.items[existingIdx].quantity + quantity,
          10
        );
        toast.success('Cart updated!');
      } else {
        const price = variant?.salePrice || variant?.price || product.salePrice || product.price || 0;
        const original = variant?.price || product.price || price;
        const finalPrice = price;

        state.items.push({
          productId: product._id,
          variantId,
          name: product.name,
          slug: product.slug,
          image: product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url,
          price: Math.round(finalPrice * 100) / 100,
          originalPrice: original,
          metal: variant?.metal,
          sku: variant?.sku,
          quantity,
          customization: customization || {}
        });
        toast.success('Added to cart!');
      }
      ls.set('sk_cart', state.items);
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      ls.set('sk_cart', state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(
        i => i.productId === productId && i.variantId === variantId
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.productId === productId && i.variantId === variantId)
          );
        } else {
          item.quantity = Math.min(quantity, 10);
        }
        ls.set('sk_cart', state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      ls.del('sk_cart');
    },

    toggleCartDrawer: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; }
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartOpen = (state) => state.cart.isOpen;

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartDrawer, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
