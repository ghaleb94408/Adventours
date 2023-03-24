const Tour = require('../models/tourModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tours data from DB
  const tours = await Tour.find();
  // 3) Render Template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour data from DB
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // 2) Render Template
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in',
  });
};
