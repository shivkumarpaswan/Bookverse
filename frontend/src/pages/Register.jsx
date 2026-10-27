import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiBook, FiShoppingBag } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    try {
      await register(form);
      toast.success('Account created! 🎉');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left - Visual */}
      <div className="hidden md:flex items-center justify-center bg-vintage-900 relative overflow-hidden order-2 md:order-1">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-900 via-vintage-900/70 to-transparent" />
        <div className="relative text-center text-white px-12">
          <div className="text-8xl mb-6">📖</div>
          <h2 className="font-serif text-4xl font-bold mb-4">Join BookVerse</h2>
          <p className="text-vintage-200 text-lg">Create an account and start exploring thousands of books.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-vintage-50 order-1 md:order-2">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="bg-vintage-900 text-white p-2 rounded-lg">
              <FiBook size={22} />
            </div>
            <span className="font-serif text-2xl font-bold text-vintage-900">
              Book<span className="text-vintage-500">Verse</span>
            </span>
          </Link>

          <h1 className="font-serif text-4xl font-bold text-vintage-900 mb-2">Create account</h1>
          <p className="text-vintage-600 mb-8">Start your book journey today</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-vintage-900 mb-2 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" />
                <input placeholder="John Doe" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none bg-white" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-vintage-900 mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" />
                <input type="email" placeholder="you@example.com" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none bg-white" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-vintage-900 mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" />
                <input type="password" placeholder="Min 6 characters" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none bg-white" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-vintage-900 mb-2 block">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm({ ...form, role: 'user' })}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    form.role === 'user' ? 'border-vintage-900 bg-vintage-50 shadow-md' : 'border-vintage-200 hover:border-vintage-500'
                  }`}>
                  <FiShoppingBag className="mx-auto text-vintage-900 mb-2" size={24} />
                  <p className="font-semibold text-vintage-900">Buy Books</p>
                  <p className="text-xs text-vintage-600">Browse & purchase</p>
                </button>
                <button type="button" onClick={() => setForm({ ...form, role: 'seller' })}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    form.role === 'seller' ? 'border-vintage-900 bg-vintage-50 shadow-md' : 'border-vintage-200 hover:border-vintage-500'
                  }`}>
                  <FiBook className="mx-auto text-vintage-900 mb-2" size={24} />
                  <p className="font-semibold text-vintage-900">Sell Books</p>
                  <p className="text-xs text-vintage-600">List your books</p>
                </button>
              </div>
            </div>

            <button className="btn-shine w-full bg-vintage-900 text-white py-4 rounded-xl font-semibold hover:bg-vintage-700 transition shadow-lg">
              Create Account
            </button>
          </form>

          <p className="text-center text-vintage-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-vintage-900 font-bold hover:text-vintage-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}