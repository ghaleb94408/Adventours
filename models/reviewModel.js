const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utility/appError');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    rating: {
      type: Number,
      max: [5, 'A review rating must be between 1 and 5'],
      min: [1, 'A review rating must be between 1 and 5'],
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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // When a new review is created this function will calculate the amount of ratings and their average and add update the corresponding tour accordingly
  // This points to the Model (Review)
  const [stats] = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats) {
    await Tour.findByIdAndUpdate(stats._id, {
      ratingsQuantity: stats.nRating,
      ratingsAverage: stats.avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      // Default values
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  // this points to current review
  // this.constructor = Review
  this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  console.log(this);
  this.rev = await this.clone().findOne();
  if (!this.rev)
    return next(new AppError('No review was found to delete', 404));
  console.log(this.rev);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  console.log(this.rev);
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
