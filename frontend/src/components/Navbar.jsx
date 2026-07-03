import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaRegHeart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { count, toggle } = useCart();

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Left Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end pr-12">
            <div className="relative group cursor-pointer flex items-center gap-1 text-[13px] font-bold text-[#1F1F1F] hover:text-[#4A4A4A] uppercase tracking-wide">
              COVER COLLECTION <FaChevronDown size={10} className="mt-0.5" />
              <div className="absolute top-full left-0 mt-4 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/products?category=Divine Lords" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 border-b border-gray-50">Divine Lords</Link>
                <Link to="/products?category=Raj Gharana" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 border-b border-gray-50">Raj Gharana</Link>
                <Link to="/products?category=Name and Logo" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 border-b border-gray-50">Name and Logo</Link>
                <Link to="/products?category=Flower Bloom" className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50">Flower Bloom</Link>
              </div>
            </div>
            <Link to="/" className="text-[13px] font-bold text-[#1F1F1F] uppercase tracking-wide border-b-2 border-[#1F1F1F] pb-1">HOME</Link>
          </div>

          {/* Center Logo */}
          <Link to="/" className="flex items-center justify-center text-decoration-none gap-3">
            <img src="/logo.png" alt="Amrit Silver Logo" className="h-12 w-auto object-contain" onError={(e) => e.target.style.display = 'none'} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#4A0000] capitalize font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              Amrit Silver
            </h1>
          </Link>

          {/* Right Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-6 flex-1 pl-12">
            <Link to="/contact" className="text-[13px] font-bold text-[#1F1F1F] hover:text-[#4A4A4A] uppercase tracking-wide">CONTACT US</Link>
            <Link to="/about" className="text-[13px] font-bold text-[#1F1F1F] hover:text-[#4A4A4A] uppercase tracking-wide">ABOUT US</Link>
            
            <div className="flex items-center gap-5 ml-auto">
              <Link to={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center gap-1 text-[#1F1F1F] hover:text-stone-600 transition-colors">
                <FaUser size={18} />
                <span className="text-[10px] uppercase font-medium">Account</span>
              </Link>

              <Link to="/wishlist" className="flex flex-col items-center gap-1 text-[#1F1F1F] hover:text-stone-600 transition-colors">
                <FaRegHeart size={18} />
                <span className="text-[10px] uppercase font-medium">Wishlist</span>
              </Link>

              <button onClick={toggle} className="relative flex flex-col items-center gap-1 text-[#1F1F1F] hover:text-stone-600 transition-colors">
                <FaShoppingBag size={18} />
                <span className="text-[10px] uppercase font-medium">Cart</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#4A0000] text-white text-[9px] rounded-full w-[16px] h-[16px] flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggle} className="relative text-[#1F1F1F] text-xl">
              <FaShoppingBag />
            </button>
            <button className="text-2xl text-[#1F1F1F]" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

        </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full z-40">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-bold border-b border-gray-50 uppercase text-sm">HOME</Link>
          <Link to="/products?category=Royal Edition" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-bold border-b border-gray-50 uppercase text-sm">COVER COLLECTION</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-bold border-b border-gray-50 uppercase text-sm">CONTACT US</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block py-3 text-[#1F1F1F] font-bold border-b border-gray-50 uppercase text-sm">ABOUT US</Link>
        </div>
      )}
      </nav>
    </>
  );
};

export default Navbar;
