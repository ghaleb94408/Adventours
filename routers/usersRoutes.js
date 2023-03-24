const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
// protect all routes after this middleware
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me', userController.updateMe);
router.patch('/update-password', authController.updatePassword);
router.delete('/delete-me', userController.deleteMe);
router.use(authController.restrictTo(['admin']));
router
  .route('/')
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
