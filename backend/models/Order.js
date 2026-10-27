const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    title: String,
    price: Number,
    qty: Number,
    image: String
  }],
  totalAmount: Number,
  discount: { type: Number, default: 0 },
  couponCode: String,
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay', 'Stripe'] },
  paymentId: String,
  paymentStatus: { type: String, default: 'pending' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingId: String,
  cancelReason: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);