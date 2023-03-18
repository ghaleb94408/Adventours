const User = require('../models/userModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');

const filterObj = (data, ...fields) => {
  // This function is to filter the input and only allow the user to modify specific fields
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (fields.includes(key)) filteredData[key] = data[key];
  });
  return filteredData;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    users,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) return an error if the user try to modify the password in this path
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('To update your password please use /update-me'),
      400
    );
  // 2) Update user document with filtered data
  const filteredData = filterObj(req.body, 'email', 'name');
  const updateUser = await User.findByIdAndUpdate(req.user._id, filteredData, {
    new: true,
    runValidators: true,
  });
  // 3) Send response
  res.status(201).json({
    status: 'Success',
    updateUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: 'Scuccess',
  });
});
// for development only, Delete later
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  res.status(203).json({
    status: 'Success',
  });
});
