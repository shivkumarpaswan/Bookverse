import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';

export default function BookDetail() {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/books/${id}`).then(res => setData(res.data));
    api.get(`/reviews/${id}`).then(res => setReviews(res.data));
    if (user) {
      const recent = JSON.parse(localStorage.getItem('recent') || '[]');
      localStorage.setItem('recent', JSON.stringify([id, ...recent.filter(x => x !== id)].slice(0, 10)));
    }
  }, [id, user]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login first');
    try {
      const { data: r } = await api.post(`/reviews/${id}`, { rating, comment });
      setReviews([r, ...reviews]);
      setComment('');
      toast.success('Review added!');
    } catch { toast.error('Failed'); }
  };

  if (!data) return <div className="p-10 text-center text-vintage-600">Loading...</div>;
  const { book, related } = data;
  const images = book.images?.length ? book.images : ['https://via.placeholder.com/400x600?text=Book'];
  const inWishlist = wishlist.find(b => b._id === book._id);
  const discount = book.mrp && book.mrp > book.price
    ? Math.round(((book.mrp - book.price) / book.mrp) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-vintage-600 mb-6">
        <Link to="/" className="hover:text-vintage-900">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/books" className="hover:text-vintage-900">Books</Link>
        <span className="mx-2">/</span>
        <span className="text-vintage-900">{book.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="animate-fade-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg relative">
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                {discount}% OFF
              </div>
            )}
            <img src={images[activeImg]} className="w-full h-[500px] object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer transition ${
                    i === activeImg ? 'ring-2 ring-vintage-900 scale-105' : 'opacity-60 hover:opacity-100'
                  }`} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-vintage-100 text-vintage-700 text-sm font-semibold px-3 py-1 rounded-full">
              {book.condition}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <FiStar fill="currentColor" size={16} />
              <span className="text-sm font-medium text-gray-700">
                {book.ratings || 0} ({book.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-vintage-900 leading-tight mb-3">
            {book.title}
          </h1>
          <p className="text-lg text-vintage-600 mb-6">by <span className="font-semibold">{book.author}</span></p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-vintage-900">₹{book.price}</span>
            {book.mrp && book.mrp > book.price && (
              <span className="text-xl text-gray-400 line-through">₹{book.mrp}</span>
            )}
            {discount > 0 && (
              <span className="text-green-600 font-semibold">Save ₹{book.mrp - book.price}</span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 bg-vintage-50 rounded-2xl p-5 mb-6">
            {[
              { label: 'Category', value: book.category },
              { label: 'Language', value: book.language },
              { label: 'Year', value: book.year },
              { label: 'Publisher', value: book.publisher },
              { label: 'ISBN', value: book.isbn || 'N/A' },
              { label: 'Stock', value: book.stock || 1 }
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-vintage-500 uppercase font-semibold mb-1">{item.label}</p>
                <p className="text-vintage-900 font-medium">{item.value || 'N/A'}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">{book.description}</p>

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <button onClick={() => { addToCart(book); toast.success('Added to cart'); }}
              className="btn-shine flex-1 bg-vintage-900 text-white py-4 rounded-xl font-semibold hover:bg-vintage-700 transition shadow-lg flex items-center justify-center gap-2">
              <FiShoppingCart /> Add to Cart
            </button>
            <button onClick={() => { toggleWishlist(book); toast.success(inWishlist ? 'Removed' : 'Added to wishlist'); }}
              className={`w-14 flex items-center justify-center rounded-xl border-2 transition ${
                inWishlist ? 'bg-pink-500 border-pink-500 text-white' : 'border-vintage-200 text-vintage-900 hover:border-pink-500 hover:text-pink-500'
              }`}>
              <FiHeart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-vintage-100">
            <div className="text-center">
              <FiTruck className="mx-auto text-vintage-500 mb-1" size={20} />
              <p className="text-xs text-vintage-700 font-medium">Free Shipping</p>
            </div>
            <div className="text-center">
              <FiShield className="mx-auto text-vintage-500 mb-1" size={20} />
              <p className="text-xs text-vintage-700 font-medium">Secure Payment</p>
            </div>
            <div className="text-center">
              <FiRefreshCw className="mx-auto text-vintage-500 mb-1" size={20} />
              <p className="text-xs text-vintage-700 font-medium">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="text-3xl font-serif font-bold text-vintage-900 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        <form onSubmit={submitReview} className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="font-semibold text-vintage-900 mb-4">Write a Review</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <select value={rating} onChange={e => setRating(+e.target.value)}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none bg-white">
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>)}
            </select>
            <input value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="border-2 border-vintage-200 p-3 rounded-xl flex-1 focus:border-vintage-500 focus:outline-none" />
            <button className="btn-shine bg-vintage-900 text-white px-8 py-3 rounded-xl hover:bg-vintage-700 transition font-medium">
              Post Review
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-vintage-600 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : reviews.map(r => (
            <div key={r._id} className="bg-white p-5 rounded-2xl shadow-sm border border-vintage-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-vintage-500 text-white rounded-full flex items-center justify-center font-bold">
                    {r.userId?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <b className="text-vintage-900">{r.userId?.name || 'User'}</b>
                    <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-amber-500">{'⭐'.repeat(r.rating)}</div>
              </div>
              <p className="text-gray-700 ml-13">{r.comment}</p>
              <button
                onClick={() => api.put(`/reviews/${r._id}/helpful`).then(() =>
                  setReviews(reviews.map(x => x._id === r._id ? { ...x, helpful: x.helpful + 1 } : x)))}
                className="mt-3 text-sm text-vintage-600 hover:text-vintage-900 transition">
                👍 Helpful ({r.helpful || 0})
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related?.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-serif font-bold text-vintage-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}