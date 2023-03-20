const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewsRoutes');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(tourController.getAllTours).post(
  // authController.protect,
  // authController.restrictTo(['admin', 'tour-leader']),
  tourController.createTour
);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo(['admin']),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    tourController.deleteTour
  );
module.exports = router;
