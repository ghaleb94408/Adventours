const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/', viewController.getOverview);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.login);
module.exports = router;
