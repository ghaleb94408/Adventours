const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour ',
      required: [true, 'A review must belong to a tour'],
    },
    rating: {
      type: Number,
      max: [5, 'A review rating must be between 1 and 5'],
      min: [5, 'A review rating must be between 1 and 5'],
      required: [true, 'A review must have a rating'],
    },
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
