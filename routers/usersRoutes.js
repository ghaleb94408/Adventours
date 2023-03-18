const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/sign-in', authController.signIn);
router.patch('/update-me', authController.protect, userController.updateMe);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);
router.delete('/delete-me', authController.protect, userController.deleteMe);
router
  .route('/')
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);
module.exports = router;
