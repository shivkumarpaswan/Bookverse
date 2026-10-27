import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem('cart') || '[]')
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('wishlist') || '[]')
  );

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (book) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === book._id);
      if (exists) return prev.map(i => i._id === book._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...book, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(p => p.filter(i => i._id !== id));
  const updateQty = (id, qty) => setCart(p => p.map(i => i._id === id ? { ...i, qty } : i));
  const clearCart = () => setCart([]);

  const toggleWishlist = (book) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === book._id);
      return exists ? prev.filter(i => i._id !== book._id) : [...prev, book];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart, total,
      wishlist, toggleWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);