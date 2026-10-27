import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (!cart.length) return (
    <div className="max-w-3xl mx-auto p-20 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="text-4xl font-serif font-bold text-vintage-900 mb-3">Your cart is empty</h2>
      <p className="text-vintage-600 mb-8">Looks like you haven't added any books yet.</p>
      <Link to="/books"
        className="btn-shine inline-flex items-center gap-2 bg-vintage-900 text-white px-8 py-3.5 rounded-xl hover:bg-vintage-700 transition font-semibold shadow-lg">
        <FiShoppingBag /> Browse Books
      </Link>
    </div>
  );

  const shipping = total > 500 ? 0 : 50;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-serif font-bold text-vintage-900 mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-vintage-100 hover:shadow-md transition">
              <img src={item.images?.[0] || 'https://via.placeholder.com/100'}
                className="w-24 h-32 object-cover rounded-xl" />
              <div className="flex-1">
                <Link to={`/books/${item._id}`}
                  className="font-serif font-bold text-lg text-vintage-900 hover:text-vintage-500 transition line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 mb-2">by {item.author}</p>
                <p className="text-vintage-900 font-bold text-xl">₹{item.price}</p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <button onClick={() => { removeFromCart(item._id); toast.success('Removed'); }}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                  <FiTrash2 />
                </button>
                <div className="flex items-center gap-2 bg-vintage-50 rounded-lg p-1">
                  <button onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                    className="w-8 h-8 bg-white rounded-md hover:bg-vintage-100 flex items-center justify-center transition shadow-sm">
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}
                    className="w-8 h-8 bg-white rounded-md hover:bg-vintage-100 flex items-center justify-center transition shadow-sm">
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24 border border-vintage-100">
          <h2 className="font-serif text-2xl font-bold text-vintage-900 mb-5">Order Summary</h2>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-medium">₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-vintage-600 bg-vintage-50 p-2 rounded-lg">
                💡 Add ₹{500 - total} more for free shipping
              </p>
            )}
          </div>

          <div className="border-t border-vintage-100 pt-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-vintage-900">Total</span>
              <span className="text-2xl font-bold text-vintage-900">₹{total + shipping}</span>
            </div>
          </div>

          <Link to="/checkout"
            className="btn-shine w-full bg-vintage-900 text-white py-4 rounded-xl font-semibold hover:bg-vintage-700 transition shadow-lg flex items-center justify-center gap-2">
            Proceed to Checkout <FiArrowRight />
          </Link>

          <Link to="/books" className="block text-center text-vintage-600 hover:text-vintage-900 mt-4 text-sm font-medium">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}