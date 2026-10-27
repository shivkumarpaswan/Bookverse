import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books').then(res =>
      setBooks(res.data.books.filter(b => b.sellerId === user.id))
    );
  }, [user]);

  const remove = async (id) => {
    if (!confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    setBooks(books.filter(b => b._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Seller Dashboard</h1>
        <Link to="/sell" className="bg-vintage-900 text-white px-4 py-2 rounded">+ Add Book</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Books" value={books.length} />
        <Stat label="Approved" value={books.filter(b => b.approved).length} />
        <Stat label="Pending" value={books.filter(b => !b.approved).length} />
        <Stat label="Total Views" value={books.reduce((s, b) => s + (b.views || 0), 0)} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-vintage-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id} className="border-b dark:border-gray-700">
                <td className="p-3">{b.title}</td>
                <td className="p-3 text-center">₹{b.price}</td>
                <td className="p-3 text-center">
                  <span className={b.approved ? 'text-green-600' : 'text-yellow-600'}>
                    {b.approved ? 'Live' : 'Pending'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => remove(b._id)} className="text-red-500 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-vintage-900 dark:text-vintage-100">{value}</p>
  </div>
);