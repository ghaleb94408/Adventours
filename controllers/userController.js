const User = require('../models/userModel');
const catchAsync = require('../utility/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    users,
  });
});
// for development only, Delete later
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  res.status(203).json({
    status: 'Success',
  });
});
