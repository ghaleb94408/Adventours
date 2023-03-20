const Review = require('../models/reviewModel');
const catchAsync = require('../utility/catchAsync');
// const AppError = require('../utility/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    reviews,
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const postReview = {
    tour: req.body.tour,
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.user,
  };
  const review = await Review.create(postReview);
  res.status(201).json({
    status: 'Success',
    review,
  });
});
