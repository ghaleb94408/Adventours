const { query } = require('express');
const Tour = require('../models/tourModel');
exports.getAllTours = async (req, res) => {
  try {
    // A) Filtering
    // 1) Get the filter data from the URL
    const queryObj = { ...req.query };
    // 2) exclude these files from the filter
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let reqString = JSON.stringify(queryObj);
    reqString = JSON.parse(
      reqString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    console.log(reqString);
    // 3) Build the query
    const query = Tour.find(reqString);
    // 4) Call the query
    const tours = await query;

    // response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res, next) => {
  try {
    const testTour = new Tour({
      name: 'The new test tour',
      price: 245,
      rating: 3.0,
    });
    console.log(req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      tour: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(203).json({
      status: 'Success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
