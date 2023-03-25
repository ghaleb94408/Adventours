const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');

const router = express.Router();
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/me', authController.protect, viewController.getAccount);
module.exports = router;
