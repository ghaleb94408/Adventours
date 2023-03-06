const mongoose = require('mongoose');
// Create Tour Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: [true, 'Tour must be unique'],
  },
  rating: Number,
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
});
// Create Tour Model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
