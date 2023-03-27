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
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-bookings', authController.protect, viewController.getMyTours);
module.exports = router;
