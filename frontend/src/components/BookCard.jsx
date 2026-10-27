import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BookCard({ book }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const inWishlist = wishlist.find(b => b._id === book._id);
  const discount = book.mrp && book.mrp > book.price
    ? Math.round(((book.mrp - book.price) / book.mrp) * 100) : 0;

  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-md group relative">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(book); toast.success(inWishlist ? 'Removed' : 'Added to wishlist'); }}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition ${
          inWishlist ? 'bg-pink-500 text-white' : 'bg-white/90 text-vintage-900 hover:bg-pink-500 hover:text-white'
        }`}>
        <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/books/${book._id}`}>
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-vintage-100">
          <img
            src={book.images?.[0] || 'https://via.placeholder.com/200x300?text=Book'}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-vintage-100 text-vintage-700 px-2 py-0.5 rounded-full">
              {book.condition}
            </span>
            <span className="text-xs text-gray-500">⭐ {book.ratings || 0}</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-vintage-900 line-clamp-2 mb-1 group-hover:text-vintage-500 transition">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3 truncate">by {book.author}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-vintage-900">₹{book.price}</span>
            {book.mrp && book.mrp > book.price && (
              <span className="text-sm text-gray-400 line-through">₹{book.mrp}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={() => { addToCart(book); toast.success('Added to cart'); }}
          className="btn-shine w-full bg-vintage-900 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-vintage-700 transition shadow-md">
          <FiShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}