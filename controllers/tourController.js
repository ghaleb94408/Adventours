const Tour = require('../models/tourModel');
const APIFeatures = require('../utility/APIFeatures');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');

exports.getAllTours = catchAsync(async (req, res) => {
  //  Call the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  // response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
    options: { _recursed: true },
  });
  // if no tour is found with the id return an error
  if (!tour) return next(new AppError('No tour was found', 404));
  res.status(200).json({
    status: 'Success',
    tour,
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Success',
    tour: newTour,
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if no tour is found with the id return an error
  if (!tour) return next(new AppError('No tour was found', 404));
  res.status(203).json({
    status: 'Success',
    tour,
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  // if no tour is found with the id return an error
  if (!tour) return next(new AppError('No tour was found', 404));
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: stats,
  });
});
