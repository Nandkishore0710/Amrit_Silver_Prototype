import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { count, toggle } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="silverine-topbar py-1.5 px-4 flex justify-between items-center text-[13px]">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors"><i className="fab fa-instagram"></i></a>
          <a href="#" className="hover:text-gray-300 transition-colors"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="hover:text-gray-300 transition-colors"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="text-center flex-1 font-medium tracking-wide">
          WELCOME TO WORLDWIDE SILVERINE
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          <a href="#" className="hover:text-gray-300 transition-colors">FAQs</a>
        </div>
      </div>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-decoration-none mr-8">
            <h1 className="text-2xl font-bold tracking-widest text-[#1F1F1F] uppercase" style={{ fontFamily: 'var(--pls-primary-font)' }}>Silverine</h1>
          </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products?category=Mobile Covers" className="text-stone-600 hover:text-stone-900 text-sm font-medium">Mobile Covers</Link>
          <Link to="/products?category=Jewelry" className="text-stone-600 hover:text-stone-900 text-sm font-medium">Jewelry</Link>
          <Link to="/products?category=Idols" className="text-stone-600 hover:text-stone-900 text-sm font-medium">Idols</Link>
          <Link to="/products?category=Bracelets" className="text-stone-600 hover:text-stone-900 text-sm font-medium">Bracelets</Link>
          <Link to="/products?sort=best-sellers" className="text-stone-600 hover:text-stone-900 text-sm font-medium">Best Sellers</Link>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent text-sm w-32 lg:w-48 text-stone-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-stone-500"><FaSearch /></button>
          </form>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-stone-700 hover:text-stone-900 text-xl">
                  <FaUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Orders</Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Dashboard</Link>
                      <Link to="/admin/products" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Manage Products</Link>
                    </>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-stone-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-stone-700 hover:text-stone-900 text-xl"><FaUser /></Link>
            )}

            <button onClick={toggle} className="relative text-stone-700 hover:text-stone-900 text-xl">
              <FaShoppingBag />
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button className="md:hidden text-2xl text-stone-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full z-40">
          <Link to="/products?category=Mobile Covers" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-medium border-b border-gray-50 uppercase text-sm">Mobile Covers</Link>
          <Link to="/products?category=Jewelry" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-medium border-b border-gray-50 uppercase text-sm">Jewelry</Link>
          <Link to="/products?category=Idols" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-medium border-b border-gray-50 uppercase text-sm">Idols</Link>
          <Link to="/products?category=Bracelets" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-medium border-b border-gray-50 uppercase text-sm">Bracelets</Link>
          <Link to="/products?sort=best-sellers" onClick={() => setIsOpen(false)} className="block py-3 text-danger font-medium border-b border-gray-50 uppercase text-sm">Hotshots</Link>
          <form onSubmit={handleSearch} className="mt-4 flex border border-gray-300 rounded-full px-4 py-2 bg-white">
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none bg-transparent text-sm flex-1 text-[#1F1F1F]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-[#1F1F1F]"><FaSearch /></button>
          </form>
        </div>
      )}
      </nav>
    </>
  );
};

export default Navbar;
