import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SellBook() {
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', description: '',
    price: '', mrp: '', condition: 'Good',
    category: 'Fiction', language: 'English',
    year: '', publisher: '', images: ['']
  });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', form);
      toast.success('Book submitted for approval!');
      nav('/seller');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed');
    }
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-serif font-bold mb-6">Sell Your Book 📚</h1>
      <form onSubmit={submit} className="space-y-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <input placeholder="Title" required value={form.title} onChange={e => update('title', e.target.value)} className="w-full border p-2 rounded" />
        <input placeholder="Author" required value={form.author} onChange={e => update('author', e.target.value)} className="w-full border p-2 rounded" />
        <input placeholder="ISBN" value={form.isbn} onChange={e => update('isbn', e.target.value)} className="w-full border p-2 rounded" />
        <textarea placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} className="w-full border p-2 rounded" rows="3" />

        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Your Price ₹" required value={form.price} onChange={e => update('price', e.target.value)} className="border p-2 rounded" />
          <input type="number" placeholder="MRP ₹" value={form.mrp} onChange={e => update('mrp', e.target.value)} className="border p-2 rounded" />
        </div>

        <select value={form.condition} onChange={e => update('condition', e.target.value)} className="w-full border p-2 rounded">
          {['Like New', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Category" value={form.category} onChange={e => update('category', e.target.value)} className="border p-2 rounded" />
          <input placeholder="Language" value={form.language} onChange={e => update('language', e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Year" value={form.year} onChange={e => update('year', e.target.value)} className="border p-2 rounded" />
          <input placeholder="Publisher" value={form.publisher} onChange={e => update('publisher', e.target.value)} className="border p-2 rounded" />
        </div>

        <input placeholder="Image URL" value={form.images[0]}
          onChange={e => update('images', [e.target.value])}
          className="w-full border p-2 rounded" />

        <button className="w-full bg-vintage-900 text-white py-3 rounded hover:bg-vintage-700">
          Submit for Approval
        </button>
      </form>
    </div>
  );
}