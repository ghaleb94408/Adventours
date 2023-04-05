const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get Tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour)
    return next(
      new AppError('No tour was found with that id. please choose a tour', 404)
    );
  // 2) Create Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/overview`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price: tour.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  // 3) send response
  res.status(200).json({
    status: 'Success',
    session,
  });
});
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
exports.createBookingDataEdit = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.body.tour });
  if (!tour) return next(new AppError('No tour was found with this name', 404));
  req.body.tour = tour.id;
  const user = await User.findOne({ email: req.body.user });
  if (!user) return next(new AppError('No user was found with this name', 404));
  req.body.user = user.id;
  if (req.body.paid) req.body.paid = true;
  else req.body.paid = false;
  next();
});
exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
