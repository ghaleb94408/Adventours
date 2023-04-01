const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const factory = require('./handlerFactory');

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
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // 1) Check if images are being updated
  // console.log(req.body.imageCover);
  if (
    !req.files ||
    (!req.files.image_1 && !req.files.image_2 && !req.files.image_3)
  )
    return next();
  // if the files come from the front end and not the postman call
  req.files.images = [
    req.files.image_1[0],
    req.files.image_2[0],
    req.files.image_3[0],
  ];
  console.log(req.files.images);
  if (!req.files || (!req.files.imageCover && !req.files.images)) return next();
  // A) Cover Image
  // 2) name the file and add it to the request
  if (req.files.imageCover) {
    const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    // 3) resize the images
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${imageCoverFilename}`);
    req.body.imageCover = imageCoverFilename;
  }
  // B) Images
  if (req.files.images) {
    req.body.images = [];
    // The next line will return an array of promises
    const imagesPromises = req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(req.files.images[index].buffer)
        .resize(2000, 1333)
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    });
    await Promise.all(imagesPromises);
  }
  next();
});
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.editTourCreateData = (req, res, next) => {
  if (typeof req.body.startDates === 'string')
    req.body.startDates = JSON.parse(req.body.startDates);
  if (typeof req.body.locations === 'string')
    req.body.locations = JSON.parse(req.body.locations);
  next();
};
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  // get the latitude and longitude
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(new AppError('Please provide latitud and longitude data', 400));
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    tours,
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
