const mongoose = require('mongoose');
const { Schema } = mongoose;
const returnsSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  movieId: { type: Schema.Types.ObjectId, required: true },
  dateReturned: Date,
  rentalFee: Number,
});

const Returns = mongoose.model('Returns', returnsSchema);
module.exports = Returns;
