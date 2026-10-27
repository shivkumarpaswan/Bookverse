import React from 'react';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useCart();

  if (!wishlist.length) return (
    <div className="max-w-3xl mx-auto p-16 text-center">
      <h2 className="text-3xl font-serif mb-4">Your wishlist is empty ❤️</h2>
      <Link to="/books" className="bg-vintage-900 text-white px-6 py-3 rounded-lg">Browse Books</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-serif font-bold mb-6">My Wishlist ❤️ ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map(b => <BookCard key={b._id} book={b} />)}
      </div>
    </div>
  );
}