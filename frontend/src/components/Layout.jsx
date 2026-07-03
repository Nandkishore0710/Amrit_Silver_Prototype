import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ErrorBoundary from './ErrorBoundary';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const location = useLocation();
  const { initializing } = useAuth();
  const { isOpen, close } = useCart();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);

  if (initializing) return null;

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {!isAdminPage && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-1"
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </motion.main>
      </AnimatePresence>
      {!isAdminPage && <Footer />}
      <CartDrawer isOpen={isOpen} onClose={close} />
    </div>
  );
};

export default Layout;
