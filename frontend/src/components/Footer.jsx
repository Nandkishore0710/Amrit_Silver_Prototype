import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 text-[14px]">
          <div>
            <h4 className="font-bold text-[#1F1F1F] mb-6 tracking-wide uppercase">Silverine</h4>
            <div className="flex flex-col gap-3">
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">About Us</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Craftsmanship</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Legacy</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#1F1F1F] mb-6 tracking-wide uppercase">Collections</h4>
            <div className="flex flex-col gap-3">
              <Link to="/products?newArrival=true" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">New Arrivals</Link>
              <Link to="/products?bestSeller=true" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Best Sellers</Link>
              <Link to="/products?featured=true" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Featured</Link>
              <Link to="/products?category=Custom" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Custom Orders</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#1F1F1F] mb-6 tracking-wide uppercase">Support</h4>
            <div className="flex flex-col gap-3">
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Shipping</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Returns</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">Guarantee</Link>
              <Link to="#" className="text-stone-600 hover:text-[#1F1F1F] transition-colors">FAQs</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#1F1F1F] mb-6 tracking-wide uppercase">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2 text-stone-600 hover:text-[#1F1F1F] transition-colors"><FaInstagram /> Instagram</a>
              <a href="#" className="flex items-center gap-2 text-stone-600 hover:text-[#1F1F1F] transition-colors"><FaYoutube /> YouTube</a>
              <a href="#" className="flex items-center gap-2 text-stone-600 hover:text-[#1F1F1F] transition-colors"><FaWhatsapp /> WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 max-w-[1320px] text-center border-t border-gray-100 pt-8 text-[13px] text-stone-500">
        © {year} Silverine. All Rights Reserved. <span className="mx-3 text-stone-300">|</span> Quality Silver Phone Covers
      </div>
    </footer>
  );
};

export default Footer;
