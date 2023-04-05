const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');
const bookingCotroller = require('../controllers/bookingController');

const router = express.Router();
router.get(
  '/',
  authController.isLoggedIn,
  bookingCotroller.createBookingCheckout,
  viewController.getHome
);
router.get('/overview', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-bookings', authController.protect, viewController.getMyTours);
router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo(['admin']),
  viewController.manageUsers
);
router.get(
  '/manage-users/:id',
  authController.protect,
  authController.restrictTo(['admin']),
  viewController.editUser
);
router.get(
  '/create-tour',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.createTour
);
router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.manageTours
);
router.get(
  '/manage-tours/:id',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.editTour
);
router.get(
  '/create-booking',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.createBooking
);
router.get(
  '/manage-bookings',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.manageBookings
);
router.get(
  '/manage-bookings/:id',
  authController.protect,
  authController.restrictTo(['admin', 'lead-guide']),
  viewController.editBooking
);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get(
  '/my-reviews/:id',
  authController.protect,
  viewController.editReview
);
module.exports = router;
