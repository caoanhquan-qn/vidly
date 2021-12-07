const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 50,
    required: true,
  },
  // embedding document
  genre: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25,
      },
    }),
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Movie = mongoose.model('Movie', movieSchema);
exports.movieSchema = movieSchema;
module.exports = Movie;
