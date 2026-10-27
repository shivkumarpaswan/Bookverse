import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: '', category: '', language: '', condition: '',
    minPrice: '', maxPrice: '', sort: 'newest'
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      page
    });
    api.get(`/books?${params}`)
      .then(res => {
        setBooks(res.data.books);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const clearFilters = () => {
    setFilters({ search: '', category: '', language: '', condition: '', minPrice: '', maxPrice: '', sort: 'newest' });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-serif font-bold text-vintage-900">Explore Books</h1>
        <p className="text-vintage-600 mt-2">Discover your next favorite read from our collection</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" size={20} />
          <input
            placeholder="Search by title, author, or ISBN..."
            value={filters.search}
            onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900 shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 bg-vintage-900 text-white px-6 py-3.5 rounded-xl hover:bg-vintage-700 transition font-medium shadow-md">
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilter && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-vintage-100 animate-fade-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl font-bold text-vintage-900">Refine Search</h3>
            <button onClick={clearFilters} className="text-sm text-vintage-500 hover:text-red-500 flex items-center gap-1">
              <FiX /> Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select value={filters.category}
              onChange={e => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900 bg-white">
              <option value="">All Categories</option>
              <option>Fiction</option><option>Non-fiction</option>
              <option>Academic</option><option>Comics</option>
            </select>

            <select value={filters.language}
              onChange={e => { setFilters({ ...filters, language: e.target.value }); setPage(1); }}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900 bg-white">
              <option value="">Any Language</option>
              <option>English</option><option>Hindi</option>
              <option>Urdu</option><option>Sanskrit</option>
            </select>

            <select value={filters.condition}
              onChange={e => { setFilters({ ...filters, condition: e.target.value }); setPage(1); }}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900 bg-white">
              <option value="">Any Condition</option>
              <option>Like New</option><option>Good</option>
              <option>Fair</option><option>Poor</option>
            </select>

            <select value={filters.sort}
              onChange={e => setFilters({ ...filters, sort: e.target.value })}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900 bg-white">
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <input placeholder="Min price ₹" value={filters.minPrice}
              onChange={e => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900" />

            <input placeholder="Max price ₹" value={filters.maxPrice}
              onChange={e => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }}
              className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none text-vintage-900" />
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-vintage-600 mb-6">{books.length} book{books.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {loading ? <Loader /> : books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="font-serif text-2xl font-bold text-vintage-900 mb-2">No books found</h3>
          <p className="text-vintage-600 mb-6">Try changing your filters or search</p>
          <button onClick={clearFilters} className="bg-vintage-900 text-white px-6 py-3 rounded-xl hover:bg-vintage-700 transition">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map(b => <BookCard key={b._id} book={b} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}
              className={`w-10 h-10 rounded-xl font-medium transition ${
                page === i + 1
                  ? 'bg-vintage-900 text-white shadow-lg'
                  : 'bg-white text-vintage-900 hover:bg-vintage-100 border border-vintage-200'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}