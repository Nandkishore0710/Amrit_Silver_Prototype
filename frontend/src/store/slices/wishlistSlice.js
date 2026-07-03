import { createSlice } from '@reduxjs/toolkit';

// Load from local storage if available
const loadWishlistState = () => {
  try {
    const serializedState = localStorage.getItem('sk_wishlist');
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

const initialState = loadWishlistState();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item._id === product._id);
      
      if (existingIndex >= 0) {
        // Item exists, remove it
        state.items.splice(existingIndex, 1);
      } else {
        // Item doesn't exist, add it
        state.items.push(product);
      }
      
      // Save to local storage
      try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('sk_wishlist', serializedState);
      } catch (err) {
        // Ignore write errors
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('sk_wishlist');
    }
  }
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
