import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart, removeFromCart, updateQuantity, clearCart,
  toggleCartDrawer, openCart, closeCart,
  selectCartItems, selectCartCount, selectCartTotal, selectCartOpen
} from '../store/slices/cartSlice';
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../utils/constants';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartTotal);
  const isOpen = useSelector(selectCartOpen);

  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? SHIPPING_COST : 0);
  const total = subtotal + tax + shippingCost;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    items, count, subtotal, tax, shippingCost, total, isOpen, freeShippingRemaining,
    addItem: (product, variant, quantity, customization) =>
      dispatch(addToCart({ product, variant, quantity, customization })),
    removeItem: (productId, variantId) => dispatch(removeFromCart({ productId, variantId })),
    updateQty: (productId, variantId, quantity) => dispatch(updateQuantity({ productId, variantId, quantity })),
    clear: () => dispatch(clearCart()),
    toggle: () => dispatch(toggleCartDrawer()),
    open: () => dispatch(openCart()),
    close: () => dispatch(closeCart())
  };
};
