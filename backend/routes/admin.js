const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [users, books, orders, reviews, revenue] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Order.countDocuments(),
    Review.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);
  res.json({
    users, books, orders, reviews,
    revenue: revenue[0]?.total || 0
  });
});

// Users
router.get('/users', async (req, res) => {
  res.json(await User.find().select('-password').sort({ createdAt: -1 }));
});

router.put('/users/:id/role', async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json(u);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
});

// Books - pending approval
router.get('/books/pending', async (req, res) => {
  res.json(await Book.find({ approved: false }).populate('sellerId', 'name email'));
});

router.put('/books/:id/approve', async (req, res) => {
  res.json(await Book.findByIdAndUpdate(req.params.id, { approved: true }, { new: true }));
});

// Bulk CSV upload (demo - expects JSON array)
router.post('/books/bulk', async (req, res) => {
  const books = await Book.insertMany(req.body.map(b => ({ ...b, approved: true })));
  res.status(201).json({ count: books.length });
});

module.exports = router;