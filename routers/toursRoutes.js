const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(['admin', 'user']),
    tourController.getAllTours
  )
  .post(
    authController.protect,
    authController.restrictTo(['admin', 'tour-leader']),
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
