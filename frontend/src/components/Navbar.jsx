import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiHeart, FiMoon, FiSun, FiUser, FiBook, FiSearch } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const { dark, toggle } = useTheme();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-vintage-900 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <FiBook size={22} />
          </div>
          <span className="font-serif text-2xl font-bold text-vintage-900">
            Book<span className="text-vintage-500">Verse</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/books" className="font-medium text-vintage-900 hover:text-vintage-500 transition-colors">
            Browse
          </Link>

          {(user?.role === 'seller' || user?.role === 'admin') && (
            <Link to="/seller" className="font-medium text-vintage-900 hover:text-vintage-500 transition-colors">
              Seller
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="font-medium text-vintage-900 hover:text-vintage-500 transition-colors">
              Admin
            </Link>
          )}

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={toggle} className="text-vintage-900 hover:text-vintage-500 transition"
              title="Toggle theme">
              {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <Link to="/wishlist" className="relative text-vintage-900 hover:text-vintage-500 transition">
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-vintage-900 hover:text-vintage-500 transition">
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* User */}
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-vintage-200">
              <Link to="/dashboard" className="flex items-center gap-2 text-vintage-900 hover:text-vintage-500 transition">
                <div className="bg-vintage-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium hidden md:block">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition font-medium">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg border-2 border-vintage-900 text-vintage-900 font-medium hover:bg-vintage-900 hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="btn-shine px-4 py-2 rounded-lg bg-vintage-900 text-white font-medium hover:bg-vintage-700 transition shadow-lg">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}