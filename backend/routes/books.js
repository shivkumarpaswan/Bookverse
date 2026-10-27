const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const { search, category, language, condition, minPrice, maxPrice,
            sort, page = 1, limit = 12 } = req.query;

    const query = { approved: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (language) query.language = language;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }

    const sortOptions = {
      priceAsc: { price: 1 }, priceDesc: { price: -1 },
      newest: { createdAt: -1 }, rating: { ratings: -1 }
    };

    const books = await Book.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit).limit(+limit);

    const total = await Book.countDocuments(query);

    res.json({ books, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('sellerId', 'name email');

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const related = await Book.find({
      category: book.category,
      _id: { $ne: book._id },
      approved: true
    }).limit(4);

    res.json({ book, related });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/books (Seller/Admin)
router.post('/', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      sellerId: req.user._id,
      approved: req.user.role === 'admin'
    });
    res.status(201).json(book);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT /api/books/:id
router.put('/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// DELETE /api/books/:id
router.delete('/:id', protect, authorize('seller', 'admin'), async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Book deleted' });
});

// GET /api/books/recommend/:userId (AI recommendation)
router.get('/recommend/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist recentlyViewed');
    const interested = [...(user?.wishlist || []), ...(user?.recentlyViewed || [])];

    if (!interested.length) {
      return res.json(await Book.find({ approved: true }).sort({ ratings: -1 }).limit(6));
    }

    const categories = [...new Set(interested.map(b => b.category))];
    const recs = await Book.find({
      category: { $in: categories },
      _id: { $nin: interested.map(b => b._id) },
      approved: true
    }).limit(6);

    res.json(recs);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/books/:id/wishlist (toggle)
router.post('/:id/wishlist', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.id;
  const idx = user.wishlist.indexOf(id);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(id);
  await user.save();
  res.json({ wishlist: user.wishlist });
});

module.exports = router;