const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');
const bookingCotroller = require('../controllers/bookingController');

const router = express.Router();
router.get(
  '/',
  bookingCotroller.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
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
module.exports = router;
