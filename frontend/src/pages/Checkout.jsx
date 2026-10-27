import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { FiTag, FiTruck, FiCreditCard, FiDollarSign } from 'react-icons/fi';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const nav = useNavigate();
  const [address, setAddress] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [payment, setPayment] = useState('COD');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/apply', { code: coupon, amount: total });
      setDiscount(data.discount);
      toast.success(`🎉 Coupon applied! Saved ₹${data.discount.toFixed(0)}`);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid coupon');
    }
  };

  const placeOrder = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.pincode)
      return toast.error('Please fill all address fields');
    if (address.phone.length !== 10)
      return toast.error('Phone must be 10 digits');

    try {
      const items = cart.map(i => ({ bookId: i._id, qty: i.qty }));
      await api.post('/orders', {
        items, shippingAddress: address,
        paymentMethod: payment,
        couponCode: discount > 0 ? coupon : null
      });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed');
    }
  };

  const shipping = total > 500 ? 0 : 50;
  const finalAmount = total + shipping - discount;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-serif font-bold text-vintage-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          {/* Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-vintage-100">
            <h2 className="font-serif text-2xl font-bold text-vintage-900 mb-5 flex items-center gap-2">
              <FiTruck /> Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Full Name *" value={address.fullName}
                onChange={e => setAddress({ ...address, fullName: e.target.value })}
                className="col-span-2 border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
              <input placeholder="Phone (10 digits) *" value={address.phone}
                onChange={e => setAddress({ ...address, phone: e.target.value })}
                maxLength={10}
                className="col-span-2 border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
              <input placeholder="Full Address *" value={address.address}
                onChange={e => setAddress({ ...address, address: e.target.value })}
                className="col-span-2 border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
              <input placeholder="City" value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
                className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
              <input placeholder="State" value={address.state}
                onChange={e => setAddress({ ...address, state: e.target.value })}
                className="border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
              <input placeholder="Pincode *" value={address.pincode}
                onChange={e => setAddress({ ...address, pincode: e.target.value })}
                maxLength={6}
                className="col-span-2 border-2 border-vintage-200 p-3 rounded-xl focus:border-vintage-500 focus:outline-none" />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-vintage-100">
            <h2 className="font-serif text-2xl font-bold text-vintage-900 mb-5 flex items-center gap-2">
              <FiCreditCard /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'COD', label: 'Cash on Delivery', icon: <FiDollarSign />, desc: 'Pay when you receive' },
                { id: 'Razorpay', label: 'Razorpay', icon: <FiCreditCard />, desc: 'UPI, Card, NetBanking' }
              ].map(m => (
                <button key={m.id} onClick={() => setPayment(m.id)}
                  className={`p-5 rounded-xl border-2 text-left transition ${
                    payment === m.id
                      ? 'border-vintage-900 bg-vintage-50 shadow-md'
                      : 'border-vintage-200 hover:border-vintage-500'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-vintage-900 text-xl">{m.icon}</span>
                    <span className="font-semibold text-vintage-900">{m.label}</span>
                  </div>
                  <p className="text-sm text-vintage-600">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24 border border-vintage-100">
          <h2 className="font-serif text-2xl font-bold text-vintage-900 mb-5">Order Summary</h2>

          <div className="space-y-3 mb-5 max-h-40 overflow-y-auto">
            {cart.map(i => (
              <div key={i._id} className="flex justify-between text-sm">
                <span className="text-gray-700 truncate mr-2">{i.title} × {i.qty}</span>
                <span className="font-medium">₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-vintage-500" size={16} />
                <input placeholder="Coupon code" value={coupon}
                  onChange={e => setCoupon(e.target.value.toUpperCase())}
                  className="w-full pl-10 border-2 border-vintage-200 p-2.5 rounded-xl text-sm focus:border-vintage-500 focus:outline-none" />
              </div>
              <button onClick={applyCoupon}
                className="bg-vintage-500 text-white px-4 rounded-xl text-sm font-medium hover:bg-vintage-700 transition">
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-xs mt-2 font-medium">✓ Coupon {coupon} applied</p>
            )}
          </div>

          <div className="border-t border-vintage-100 pt-4 space-y-2 mb-4">
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Subtotal</span><span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 text-sm font-medium">
                <span>Discount</span><span>-₹{discount.toFixed(0)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-vintage-100 pt-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-vintage-900">Total</span>
              <span className="text-2xl font-bold text-vintage-900">₹{finalAmount.toFixed(0)}</span>
            </div>
          </div>

          <button onClick={placeOrder}
            className="btn-shine w-full bg-vintage-900 text-white py-4 rounded-xl font-semibold hover:bg-vintage-700 transition shadow-lg">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}