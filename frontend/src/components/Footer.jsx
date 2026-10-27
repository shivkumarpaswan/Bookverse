import React from 'react';
import { FiBook, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-vintage-900 text-vintage-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-vintage-500 p-2 rounded-lg">
              <FiBook size={20} />
            </div>
            <span className="font-serif text-2xl font-bold text-white">
              Book<span className="text-vintage-400">Verse</span>
            </span>
          </div>
          <p className="text-vintage-300 text-sm leading-relaxed">
            Purani kitaabein, nayi kahaniyan. India's most loved marketplace for second-hand books.
          </p>
          <div className="flex gap-3 mt-4">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a key={i} href="#" className="bg-vintage-700 hover:bg-vintage-500 p-2 rounded-full transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-vintage-300">
            <li><Link to="/books" className="hover:text-vintage-400 transition">Browse Books</Link></li>
            <li><Link to="/sell" className="hover:text-vintage-400 transition">Sell a Book</Link></li>
            <li><Link to="/wishlist" className="hover:text-vintage-400 transition">Wishlist</Link></li>
            <li><Link to="/dashboard" className="hover:text-vintage-400 transition">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-vintage-300">
            <li><a href="#" className="hover:text-vintage-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-vintage-400 transition">Contact</a></li>
            <li><a href="#" className="hover:text-vintage-400 transition">Shipping Info</a></li>
            <li><a href="#" className="hover:text-vintage-400 transition">Return Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-bold text-white mb-4">Newsletter</h4>
          <p className="text-sm text-vintage-300 mb-3">Weekly book recommendations</p>
          <div className="flex gap-2">
            <input placeholder="Your email"
              className="flex-1 bg-vintage-700 border border-vintage-600 rounded-lg px-3 py-2 text-sm text-white placeholder-vintage-400 focus:outline-none focus:border-vintage-400" />
            <button className="bg-vintage-500 hover:bg-vintage-400 px-4 rounded-lg transition">
              <FiMail size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-vintage-700 py-5 text-center text-sm text-vintage-400">
        © 2025 BookVerse. Made with ❤️ in India.
      </div>
    </footer>
  );
}