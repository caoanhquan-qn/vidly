const validator = require('validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/userModel');
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Please provide email and password');
    if (!validator.isEmail(email)) throw new Error('Invalid email address');
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) throw new Error('Incorrect email or password');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) throw new Error('Incorrect email or password');
    const token = user.generateAuthToken(user._id);
    res
      .header('x-auth-token', token)
      .status(200)
      .send({
        status: 'success',
        data: {
          user: _.pick(user, ['email', 'name', '_id']),
        },
      });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
