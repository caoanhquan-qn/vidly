const User = require('../models/userModel');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// HTTP verbs request
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send('The user with given ID was not found');
  }
  console.log(user);
  res.status(200).send(user);
};

exports.createUser = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required(),
      name: Joi.string().min(1).max(50),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    const user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).send(_.pick(user, ['email', 'name', '_id']));
  } catch (err) {
    res.status(400).send(err.message);
  }
};
