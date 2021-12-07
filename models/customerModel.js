const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const customerSchema = new Schema({
  isGold: {
    type: Boolean,
    required: true,
    default: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: [
      validator.isAlphanumeric,
      'Please only use letters and numbers in your username',
    ],
    minlength: 5,
    maxlength: 25,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model('Customer', customerSchema);
exports.customerSchema = customerSchema;
module.exports = Customer;
