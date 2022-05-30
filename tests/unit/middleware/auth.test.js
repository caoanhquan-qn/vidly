const protect = require('../../../middleware/protect');
const User = require('../../../models/userModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

describe('protect middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = new User();
    const token = user.generateAuthToken(user._id);
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    protect(req, res, next);
    expect(req.user).toHaveProperty('_id', user._id.toString());
  });
});
