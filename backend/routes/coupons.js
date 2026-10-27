const express = require('express');
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// POST /api/coupons/apply
router.post('/apply', protect, async (req, res) => {
  const { code, amount } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(), active: true,
    expiresAt: { $gt: Date.now() }
  });
  if (!coupon) return res.status(404).json({ msg: 'Invalid coupon' });
  if (amount < coupon.minOrder)
    return res.status(400).json({ msg: `Min order ₹${coupon.minOrder}` });

  let discount = coupon.discountType === 'percent'
    ? (amount * coupon.discountValue) / 100
    : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.json({ discount, coupon: coupon.code });
});

// Admin CRUD
router.post('/', protect, authorize('admin'), async (req, res) => {
  const c = await Coupon.create(req.body);
  res.status(201).json(c);
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  res.json(await Coupon.find().sort({ createdAt: -1 }));
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Coupon deleted' });
});

module.exports = router;