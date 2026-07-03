import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    searchOpen: false,
    theme: 'dark',
    notifications: []
  },
  reducers: {
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    closeSearch: (state) => { state.searchOpen = false; },
    addNotification: (state, action) => {
      state.notifications.unshift({ ...action.payload, id: Date.now(), read: false });
      if (state.notifications.length > 20) state.notifications.pop();
    },
    markNotificationRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    clearNotifications: (state) => { state.notifications = []; }
  }
});

export const { toggleMobileMenu, closeMobileMenu, toggleSearch, closeSearch, addNotification, markNotificationRead, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;
