const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);

    await sendEmail({
      to: email,
      subject: 'Welcome to BookVerse 📚',
      html: `<h2>Hi ${name}!</h2><p>Welcome to BookVerse. Start exploring old books now!</p>`
    });

    res.status(201).json({
      token,
      user: { id: user._id, name, email, role: user.role }
    });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ msg: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email, role: user.role }
    });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/auth/google  (Google OAuth demo)
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset Password - BookVerse',
      html: `<p>Click <a href="${link}">here</a> to reset. Valid 15 min.</p>`
    });

    res.json({ msg: 'Reset link sent to email' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: 'Invalid/expired token' });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetExpire = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.user));

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
  res.json(user);
});

module.exports = router;