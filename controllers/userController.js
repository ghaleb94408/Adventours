const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const factory = require('./handlerFactory');

// 1) Create name and destination for image uploads
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // file name will be user-user_id-TimeStamp
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `user-${req.user._id}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });
const multerStorage = multer.memoryStorage();
// 2) create filter for uploaded files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload images only', 400), false);
  }
};
// 3) Create the upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
const filterObj = (data, ...fields) => {
  // This function is to filter the input and only allow the user to modify specific fields
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (fields.includes(key)) filteredData[key] = data[key];
  });
  return filteredData;
};
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
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
  // if the user modified his picture add it to the DB
  if (req.file) filteredData.photo = req.file.filename;
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
