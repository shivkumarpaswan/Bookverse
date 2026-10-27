import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiBook } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      nav(user.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-vintage-50">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="bg-vintage-900 text-white p-2 rounded-lg">
              <FiBook size={22} />
            </div>
            <span className="font-serif text-2xl font-bold text-vintage-900">
              Book<span className="text-vintage-500">Verse</span>
            </span>
          </Link>

          <h1 className="font-serif text-4xl font-bold text-vintage-900 mb-2">Welcome back</h1>
          <p className="text-vintage-600 mb-8">Login to continue your reading journey</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-vintage-900 mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" />
                <input type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none bg-white" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-vintage-900">Password</label>
                <Link to="/forgot-password" className="text-sm text-vintage-500 hover:text-vintage-900">Forgot?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-500" />
                <input type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-vintage-200 rounded-xl focus:border-vintage-500 focus:outline-none bg-white" />
              </div>
            </div>

            <button className="btn-shine w-full bg-vintage-900 text-white py-4 rounded-xl font-semibold hover:bg-vintage-700 transition shadow-lg">
              Login
            </button>
          </form>

          <p className="text-center text-vintage-600 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-vintage-900 font-bold hover:text-vintage-500">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden md:flex items-center justify-center bg-vintage-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-900 via-vintage-900/70 to-transparent" />
        <div className="relative text-center text-white px-12">
          <div className="text-8xl mb-6">📚</div>
          <h2 className="font-serif text-4xl font-bold mb-4">Every Book has a Story</h2>
          <p className="text-vintage-200 text-lg">Discover, buy, and sell second-hand books at unbeatable prices.</p>
        </div>
      </div>
    </div>
  );
}

 