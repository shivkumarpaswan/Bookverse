import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-vintage-900">404</h1>
      <p className="text-2xl mt-4">Page not found 📖</p>
      <p className="text-gray-500 mt-2">Lagta hai ye page kisi purani kitaab me kho gaya!</p>
      <Link to="/" className="mt-6 bg-vintage-900 text-white px-6 py-3 rounded-lg">Go Home</Link>
    </div>
  );
}