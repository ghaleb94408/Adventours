const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
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
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price: 'price_1Mq1U4GBjBj74gbs8is0Q23o',
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
