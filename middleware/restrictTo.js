const User = require('../models/userModel');

module.exports =
  (...roles) =>
  async (req, res, next) => {
    const currentUser = await User.findById(req.user._id);
    if (!roles.includes(currentUser.role)) {
      // forbidden
      return res.status(403).send('You do not have permission to perform this action');
    }
    next();
  };
