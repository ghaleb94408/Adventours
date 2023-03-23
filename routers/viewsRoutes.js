const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();
router.get('/', viewController.getOverview);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.login);
module.exports = router;
