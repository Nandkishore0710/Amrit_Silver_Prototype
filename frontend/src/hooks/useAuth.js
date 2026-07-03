import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser, logout, setInitialized } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, initializing, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (initializing) {
      if (token && !user) {
        dispatch(fetchUser());
      } else {
        dispatch(setInitialized());
      }
    }
  }, [token, user, initializing, dispatch]);

  const handleLogout = () => dispatch(logout());

  return { user, token, isAuthenticated, loading, initializing, error, logout: handleLogout };
};
