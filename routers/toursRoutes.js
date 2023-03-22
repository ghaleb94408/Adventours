const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewsRoutes');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo(['admin', 'lead-guide']),
    tourController.createTour
  );
router.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  tourController.getToursWithin
); //find the tours within x distance from where you live (latlng)
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo(['admin', 'lead-guide']),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin', 'lead-guide']),
    tourController.deleteTour
  );
module.exports = router;
