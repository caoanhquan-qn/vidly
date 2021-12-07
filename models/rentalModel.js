const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      isGold: {
        type: Boolean,
        required: true,
        default: false,
      },
      username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 25,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
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
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateReturned: {
    type: Date,
    default: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    required: true,
  },
  rentalFee: {
    type: Number,
    min: 0,
    default: 8,
    required: true,
  },
});

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;
