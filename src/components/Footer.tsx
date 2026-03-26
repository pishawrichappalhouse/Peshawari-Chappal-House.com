import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-white tracking-tighter">
              PESHAWARI <span className="text-amber-500">CHAPPAL</span>
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Crafting authentic Peshawari footwear since 1995. Our mission is to preserve the rich heritage of traditional craftsmanship while embracing modern comfort.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-amber-500 transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-500 flex-shrink-0" />
                <span>123 Heritage Lane, Peshawar, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-500 flex-shrink-0" />
                <a href="tel:+923312865834" className="hover:text-amber-500 transition-colors">+92 331 2865834</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-500 flex-shrink-0" />
                <a href="mailto:info@pishawrichappalhouse.com" className="hover:text-amber-500 transition-colors">info@pishawrichappalhouse.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs opacity-50">
            © 2026 Peshawari Chappal House. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs opacity-50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
