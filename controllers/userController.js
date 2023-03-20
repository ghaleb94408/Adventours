const User = require('../models/userModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (data, ...fields) => {
  // This function is to filter the input and only allow the user to modify specific fields
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (fields.includes(key)) filteredData[key] = data[key];
  });
  return filteredData;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) return an error if the user try to modify the password in this path
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('To update your password please use /update-me'),
      400
    );
  // 2) Update user document with filtered data
  const filteredData = filterObj(req.body, 'email', 'name');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredData, {
    new: true,
    runValidators: true,
  });
  // 3) Send response
  res.status(201).json({
    status: 'Success',
    updatedUser,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
// Disable the user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'Scuccess',
  });
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
// Delete the user account from the DB
exports.deleteUser = factory.deleteOne(User);
// for development only, Delete later
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  res.status(203).json({
    status: 'Success',
  });
});
