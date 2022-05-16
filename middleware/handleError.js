const winston = require('winston');
module.exports = (err, req, res, next) => {
  winston.error(err.stack);
  res.status(500).send('Something failed unexpectedly');
};
