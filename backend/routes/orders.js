const express = require('express');
const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).json({ msg: 'Book not found' });
      total += book.price * item.qty;
      orderItems.push({
        bookId: book._id,
        title: book.title,
        price: book.price,
        qty: item.qty,
        image: book.images?.[0]
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(), active: true,
        expiresAt: { $gt: Date.now() }
      });
      if (coupon && total >= coupon.minOrder) {
        discount = coupon.discountType === 'percent'
          ? (total * coupon.discountValue) / 100
          : coupon.discountValue;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        coupon.usedCount++;
        await coupon.save();
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount: total - discount,
      discount, couponCode,
      shippingAddress, paymentMethod,
      status: paymentMethod === 'COD' ? 'confirmed' : 'pending'
    });

    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed #${order._id.toString().slice(-6)}`,
      html: `<h2>Thanks for your order!</h2>
             <p>Total: ₹${order.totalAmount}</p>
             <p>Status: ${order.status}</p>`
    });

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, trackingId: req.body.trackingId },
    { new: true }
  );
  res.json(order);
});

// PUT /api/orders/:id/cancel (user)
router.put('/:id/cancel', protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ msg: 'Not allowed' });
  order.status = 'cancelled';
  order.cancelReason = req.body.reason;
  await order.save();
  res.json(order);
});

module.exports = router;