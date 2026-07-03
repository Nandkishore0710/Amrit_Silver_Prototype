import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="footer-custom">
            <div className="footer-col">
              <h4>Amrit Silver</h4>
              <Link to="#">About Us</Link>
              <Link to="#">Craftsmanship</Link>
              <Link to="#">Legacy</Link>
              <Link to="#">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Collections</h4>
              <Link to="/products?newArrival=true">New Arrivals</Link>
              <Link to="/products?bestSeller=true">Best Sellers</Link>
              <Link to="/products?featured=true">Featured</Link>
              <Link to="/products?category=Custom">Custom Orders</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="#">Shipping</Link>
              <Link to="#">Returns</Link>
              <Link to="#">Guarantee</Link>
              <Link to="#">FAQs</Link>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="#"><FaInstagram style={{ display: 'inline' }} /> Instagram</a>
              <a href="#"><FaYoutube style={{ display: 'inline' }} /> YouTube</a>
              <a href="#"><FaWhatsapp style={{ display: 'inline' }} /> WhatsApp</a>
            </div>
        </div>
      </div>
      <div className="footer-bottom-custom">
        © {year} Amrit Silver. Redefining Silver Artistry.  <span style={{ margin: '0 12px' }}>|</span> 925 Sterling Silver since 1993
      </div>
    </>
  );
};

export default Footer;
