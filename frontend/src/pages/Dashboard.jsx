import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlist } = useCart();
  const [orders, setOrders] = useState([]);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data));
    if (user) api.get(`/books/recommend/${user.id}`).then(res => setRecs(res.data));
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      <h1 className="text-3xl font-serif font-bold">Hi, {user.name} 👋</h1>

      {/* Orders */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>
        {orders.length === 0 ? <p className="text-gray-500">No orders yet</p> : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between">
                <div>
                  <p className="font-mono text-sm">#{o._id.slice(-6)}</p>
                  <p className="text-sm">{o.items.length} item(s)</p>
                  <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{o.totalAmount}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommendations */}
      {recs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">🤖 Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recs.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        </section>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">❤️ Wishlist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlist.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}