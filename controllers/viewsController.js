const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
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
exports.manageTours = catchAsync(async (req, res) => {
  // 1) Get tours data from DB
  const tours = await Tour.find();
  // 3) Render Template
  res.status(200).render('tourManagement', {
    title: 'Manage Tours',
    tours,
  });
});
exports.editTour = catchAsync(async (req, res, next) => {
  // 1) Get tours data from DB
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // 3) Render Template
  res.status(200).render('edit-tour', {
    title: 'Edit Tour',
    tour,
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
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup',
  });
};
exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.createTour = (req, res, next) => {
  res.status(200).render('create-tour', {
    title: 'Create Tour',
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
exports.manageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('+active');
  res.status(200).render('userManagement', {
    title: 'Manage Users',
    users,
  });
});
exports.editUser = catchAsync(async (req, res, next) => {
  const editUser = await User.findById(req.params.id);
  res.status(200).render('userEdit', {
    title: 'Manage Users',
    user: req.user,
    editUser,
  });
});
