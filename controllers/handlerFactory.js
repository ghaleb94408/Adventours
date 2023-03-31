const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const APIFeatures = require('../utility/APIFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: doc,
    });
  });
exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res) => {
    // To allow nested get reviews on a tour
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //  Call the query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    if (popOptions) features.query.populate(popOptions);
    const tours = await features.query;
    // response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours,
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // if no document is found with the id return an error
    if (!doc) return next(new AppError('No document was found', 404));
    res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id, req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if no doc is found with the id return an error
    if (!doc) return next(new AppError('No document was found', 404));
    res.status(203).json({
      status: 'Success',
      data: doc,
    });
  });
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    // if no tour is found with the id return an error
    if (!doc) return next(new AppError('No document was found', 404));
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });
