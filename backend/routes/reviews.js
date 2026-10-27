const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/:bookId', async (req, res) => {
  const reviews = await Review.find({ bookId: req.params.bookId, approved: true })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

router.post('/:bookId', protect, async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const review = await Review.create({
      bookId: req.params.bookId,
      userId: req.user._id,
      rating, comment, photos
    });

    const reviews = await Review.find({ bookId: req.params.bookId, approved: true });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(req.params.bookId, {
      ratings: avg.toFixed(1), numReviews: reviews.length
    });

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id/helpful', protect, async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id, { $inc: { helpful: 1 } }, { new: true }
  );
  res.json(review);
});

// Admin moderation
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id, { approved: true }, { new: true }
  );
  res.json(review);
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Review deleted' });
});

module.exports = router;