// const bcrypt = require('bcrypt');
const { promisify } = require('util');
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
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token)
    return next(
      new AppError('You are not logged in! please log in to get access'),
      401
    );
  // 2) Verify token (check if the token hasn't expired and has not been modified)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded.id);
  // 3) Check if user still exists
  const tokenUser = await User.findById(decoded.id);
  if (!tokenUser) return next(new AppError('This user does not exist', 401));
  // 4) Check if user has changed his password after the token was issued
  if (tokenUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed the password, please log in again'),
      401
    );
  // Grant access to the route
  req.user = tokenUser;
  next();
});
