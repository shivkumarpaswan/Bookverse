const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: String,
  description: String,
  price: { type: Number, required: true },
  mrp: Number,
  condition: {
    type: String,
    enum: ['Like New', 'Good', 'Fair', 'Poor'],
    required: true
  },
  category: String,
  language: String,
  year: Number,
  publisher: String,
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stock: { type: Number, default: 1 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });

module.exports = mongoose.model('Book', bookSchema);