const Tour = require('../models/tourModel');
const catchAsync = require('../utility/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tours data from DB
  const tours = await Tour.find();
  // 2) Build Template
  // 3) Render Template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
