import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiYoutube, FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-[#333] pt-16 pb-8 text-white">
      <div className="container mx-auto px-4 max-w-[1320px]">
        
        {/* Top Section - Brand Mission */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">AMRIT SILVER: Premium Silver Covers</h2>
          <p className="max-w-2xl text-gray-300 text-[15px] leading-relaxed">
            Amrit Silver brings you premium handcrafted 92.5 sterling silver phone covers that combine luxury, durability, and timeless elegance.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 max-w-5xl mx-auto">
          
          {/* Column 1 */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-widest uppercase mb-6">AMRIT SILVER</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-[14px] transition-colors">About Us</Link></li>
              <li><Link to="/craftsmanship" className="text-gray-400 hover:text-white text-[14px] transition-colors">Craftsmanship</Link></li>
              <li><Link to="/legacy" className="text-gray-400 hover:text-white text-[14px] transition-colors">Legacy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-[14px] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-widest uppercase mb-6">COLLECTIONS</h4>
            <ul className="space-y-4">
              <li><Link to="/products?sort=new" className="text-gray-400 hover:text-white text-[14px] transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?sort=popular" className="text-gray-400 hover:text-white text-[14px] transition-colors">Best Sellers</Link></li>
              <li><Link to="/products?featured=true" className="text-gray-400 hover:text-white text-[14px] transition-colors">Featured</Link></li>
              <li><Link to="/custom-orders" className="text-gray-400 hover:text-white text-[14px] transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-widest uppercase mb-6">SUPPORT</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping" className="text-gray-400 hover:text-white text-[14px] transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white text-[14px] transition-colors">Returns</Link></li>
              <li><Link to="/guarantee" className="text-gray-400 hover:text-white text-[14px] transition-colors">Guarantee</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-[14px] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-[13px] font-bold text-white tracking-widest uppercase mb-6">CONNECT</h4>
            <ul className="space-y-4">
              <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white text-[14px] transition-colors"><FiInstagram size={16} /> Instagram</a></li>
              <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white text-[14px] transition-colors"><FiYoutube size={16} /> YouTube</a></li>
              <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white text-[14px] transition-colors"><FiMessageCircle size={16} /> WhatsApp</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-center items-center gap-2 text-[13px] text-gray-400">
          <p>© {new Date().getFullYear()} Amrit Silver. All Rights Reserved.</p>
          <span className="hidden md:inline text-gray-600">|</span>
          <p>Quality Silver Phone Covers</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
