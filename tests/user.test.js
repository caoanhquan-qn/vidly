const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
describe('user.generateAuthToken', () => {
  it('should return a valid token', () => {
    const user = new User();
    const token = user.generateAuthToken(user._id);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ _id: user._id });
  });
});
