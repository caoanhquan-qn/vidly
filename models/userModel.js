const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    select: false,
  },
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});
userSchema.methods.generateAuthToken = function (id) {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
