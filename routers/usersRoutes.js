const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);
router.post('/signup', authController.signUp);
module.exports = router;
