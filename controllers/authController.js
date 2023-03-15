// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');

const signJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = req.body;
  const user = await User.create({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    passwordConfirm: newUser.passwordConfirm,
  });
  const token = signJWT(user._id);
  res.status(200).json({
    status: 'Success',
    user,
    token,
  });
});
exports.signIn = catchAsync(async (req, res, next) => {
  // 1) Get the email and password
  const { email: signInEmail, password: signInPassword } = req.body;
  if (!signInEmail || !signInPassword)
    return next(
      new AppError('Please provide an email address and a password', 400)
    );
  // 2) Check if a user exists with the same email address and that the password is correct
  const user = await User.findOne({ email: signInEmail }).select('+password');
  const correct = await user.authenticateUser(signInPassword, user.password);

  if (!user || !correct)
    return next(
      new AppError('Wrong password or email address, please try again'),
      401
    );
  // 4) Sign a JWT Token and send back the response
  console.log('jwt.sign not async func');
  const token = signJWT(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});
