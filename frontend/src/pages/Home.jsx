import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/books?limit=8&sort=rating')
      .then(res => setBooks(res.data.books))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Fiction', icon: '📖', color: 'from-rose-400 to-rose-600' },
    { name: 'Non-fiction', icon: '🧠', color: 'from-blue-400 to-blue-600' },
    { name: 'Academic', icon: '🎓', color: 'from-emerald-400 to-emerald-600' },
    { name: 'Comics', icon: '💥', color: 'from-amber-400 to-amber-600' }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-vintage-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-vintage-900 via-vintage-900/95 to-vintage-900/70" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-block bg-vintage-500/20 border border-vintage-500 text-vintage-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              ✨ 10,000+ Old Books
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Purani Kitaabein,<br />
              <span className="text-vintage-400">Nayi Kahaniyan</span>
            </h1>
            <p className="text-xl text-vintage-100/80 mb-8 max-w-lg">
              Buy, sell, and exchange second-hand books at unbeatable prices. Every book has a story — find yours.
            </p>
            <div className="flex gap-4">
              <Link to="/books"
                className="btn-shine bg-vintage-500 hover:bg-vintage-400 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl transition">
                Browse Books →
              </Link>
              <Link to="/sell"
                className="border-2 border-vintage-100/30 hover:border-vintage-100 text-white px-8 py-3.5 rounded-xl font-semibold transition">
                Sell a Book
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center animate-fade-up">
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-vintage-400 to-vintage-700 rounded-2xl shadow-2xl rotate-3" />
              <div className="absolute top-8 left-8 w-80 h-96 bg-gradient-to-br from-vintage-200 to-vintage-500 rounded-2xl shadow-2xl -rotate-3" />
              <div className="absolute top-16 left-16 w-80 h-96 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="font-serif text-2xl font-bold text-vintage-900">Every Book</p>
                  <p className="text-vintage-500">has a story</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-vintage-100 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '10K+', label: 'Books Listed' },
            { num: '5K+', label: 'Happy Readers' },
            { num: '50+', label: 'Categories' },
            { num: '4.8★', label: 'Avg Rating' }
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-serif font-bold text-vintage-900">{s.num}</p>
              <p className="text-vintage-600 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-vintage-900">⭐ Top Rated Books</h2>
            <p className="text-vintage-600 mt-2">Handpicked by our readers</p>
          </div>
          <Link to="/books" className="text-vintage-700 font-semibold hover:text-vintage-500">
            View all →
          </Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map(b => <BookCard key={b._id} book={b} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-serif font-bold text-vintage-900 mb-2">Browse Categories</h2>
        <p className="text-vintage-600 mb-8">Find your next favorite book</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(c => (
            <Link key={c.name} to={`/books?category=${c.name}`}
              className={`bg-gradient-to-br ${c.color} text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
              <div className="text-5xl mb-3">{c.icon}</div>
              <p className="font-serif text-xl font-bold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}