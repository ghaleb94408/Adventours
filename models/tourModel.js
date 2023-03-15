const mongoose = require('mongoose');
// Create Tour Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: [true, 'Tour must be unique'],
      maxLength: [40, 'Tour name must be less than 40 charcters'],
      minLength: [10, 'Tour name must be more than 10 charcters'],
      trim: true, //Get rid of extra white space
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['difficult', 'medium', 'easy'],
        message: 'Difficulty must be: difficult, medium or easy',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating can not be less than 0'],
      max: [5, 'Rating can not be more than 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      maxLength: [120, 'Summary must be less than 40 charcters'],
      minLength: [10, 'Summary must be more than 10 charcters'],
      trim: true, //Get rid of extra white space
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tur must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Create Tour Model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
