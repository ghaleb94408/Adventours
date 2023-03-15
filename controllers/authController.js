// const env = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utility/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = req.body;
  const user = await User.create({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    passwordConfirm: newUser.passwordConfirm,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'Success',
    user,
    token,
  });
});
