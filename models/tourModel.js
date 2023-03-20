const mongoose = require('mongoose');
const slugify = require('slugify');

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
    slug: String,
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
    startLocation: {
      // GeoJson
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.index({ slug: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// Create Tour Model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
