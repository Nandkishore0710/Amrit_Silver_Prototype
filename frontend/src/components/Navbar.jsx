import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiPackage, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { CATEGORIES } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import api from '../api';
import clsx from 'clsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, toggle } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live search
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', { params: { search: searchQuery, limit: 5 } });
        setSearchResults(data.data || []);
      } catch { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Collection' },
    { to: '/products?category=Mobile+Covers', label: 'Mobile Covers' },
    { to: '/products?category=Idols', label: 'Idols' },
    { to: '/products?category=Jewelry', label: 'Jewelry' }
  ];

  return (
    <>
      <nav className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/[0.06]' : 'bg-transparent'
      )}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Amrit Silver" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to}
                  className={({ isActive }) => clsx('nav-link', isActive && 'nav-link-active')}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                id="search-toggle"
                onClick={() => setSearchOpen(true)}
                className="btn-ghost p-2"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* Cart */}
              <button
                id="cart-toggle"
                onClick={toggle}
                className="btn-ghost p-2 relative"
                aria-label="Cart"
              >
                <FiShoppingCart size={20} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    id="user-menu-toggle"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 btn-ghost p-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-700 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(user?.name)}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl overflow-hidden shadow-glass"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                          <p className="text-silver-600 text-xs truncate">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          {[
                            { to: '/profile', icon: FiUser, label: 'My Profile' },
                            { to: '/orders', icon: FiPackage, label: 'My Orders' },
                            { to: '/profile', icon: FiHeart, label: 'Wishlist' }
                          ].map(item => (
                            <Link key={item.to} to={item.to}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-silver-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                              <item.icon size={16} />
                              {item.label}
                            </Link>
                          ))}
                          {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-gold-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors text-sm">
                              <FiSettings size={16} />Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors text-sm">
                            <FiLogOut size={16} />Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex btn-primary py-2 px-4 text-sm">Sign In</Link>
              )}

              {/* Mobile menu toggle */}
              <button className="lg:hidden btn-ghost p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden glass border-t border-white/[0.06] overflow-hidden"
            >
              <div className="page-container py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <NavLink key={link.to} to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => clsx(
                      'py-3 px-2 text-silver-300 hover:text-white border-b border-white/[0.04] last:border-0',
                      isActive && 'text-gold-400'
                    )}>
                    {link.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary mt-3 text-center">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/90 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500" size={20} />
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-4 bg-dark-700 border border-white/10 rounded-2xl text-white placeholder-silver-600 focus:outline-none focus:border-gold-600 text-lg"
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-500 hover:text-white">
                  <FiX size={20} />
                </button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 glass rounded-2xl overflow-hidden"
                >
                  {searchResults.map(product => (
                    <Link
                      key={product._id}
                      to={`/product/${product.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 border-b border-white/[0.04] last:border-0 transition-colors"
                    >
                      <img src={product.images?.[0]?.url} alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        <p className="text-gold-400 text-sm">₹{product.basePrice.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
