const Review = require('../models/reviewModel');
const catchAsync = require('../utility/catchAsync');
// const AppError = require('../utility/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    reviews,
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const postReview = {
    tour: req.body.tour,
    review: req.body.review,
    rating: req.body.rating,
    user: req.user._id,
  };
  const review = await Review.create(postReview);
  res.status(201).json({
    status: 'Success',
    review,
  });
});
