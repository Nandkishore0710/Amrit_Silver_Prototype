import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { BRAND, CATEGORIES } from '../utils/constants';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 border-t border-white/[0.04] mt-auto">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-gold-900/20 via-dark-900 to-gold-900/20 border-b border-white/[0.04] py-12">
        <div className="page-container text-center">
          <h3 className="font-serif text-2xl text-white mb-2">Join the Silver Circle</h3>
          <p className="text-silver-500 text-sm mb-6">Get exclusive access to new collections, artisan stories, and member-only offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); }}>
            <input type="email" placeholder="Your email address"
              className="input flex-1 text-sm" required />
            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="font-serif text-xl text-white">Silverkaari</span>
            </Link>
            <p className="text-silver-600 text-sm leading-relaxed mb-4">{BRAND.tagline}. Pure 925 sterling silver crafted by India's master artisans.</p>
            <div className="flex gap-3">
              {[
                { icon: FiInstagram, href: BRAND.social.instagram, label: 'Instagram' },
                { icon: FiFacebook, href: BRAND.social.facebook, label: 'Facebook' },
                { icon: FiYoutube, href: BRAND.social.youtube, label: 'YouTube' },
                { icon: FiTwitter, href: BRAND.social.twitter, label: 'Twitter' }
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-silver-500 hover:text-gold-400 hover:border-gold-600/50 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="text-silver-600 hover:text-gold-400 text-sm transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/profile', label: 'My Account' },
                { to: '/orders', label: 'Order History' },
                { to: '/profile', label: 'Wishlist' },
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/register', label: 'Create Account' }
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-silver-600 hover:text-gold-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-silver-600 text-sm">
                <FiMapPin size={15} className="mt-0.5 shrink-0 text-gold-600" />
                <span>{BRAND.address}</span>
              </li>
              <li>
                <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2.5 text-silver-600 hover:text-gold-400 text-sm transition-colors">
                  <FiPhone size={15} className="text-gold-600" />{BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2.5 text-silver-600 hover:text-gold-400 text-sm transition-colors">
                  <FiMail size={15} className="text-gold-600" />{BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-silver-700 text-xs">
            © {year} {BRAND.name}. All rights reserved. Made with ♥ in India.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(label => (
              <Link key={label} to="#" className="text-silver-700 hover:text-silver-400 text-xs transition-colors">
                {label}
              </Link>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-silver-700 text-xs">
            {['Visa', 'Mastercard', 'UPI', 'RuPay'].map(p => (
              <span key={p} className="px-2 py-0.5 border border-white/10 rounded text-xs">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
