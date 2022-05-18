const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION. SHUTTING DOWN...💥');
    winston.error(err.stack);
    setTimeout(() => {
      process.exit(1);
    }, 1500);
  });
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION. SHUTTING DOWN...💥');
    winston.error(err.stack);
    setTimeout(() => {
      process.exit(1);
    }, 1500);
  });

  winston.add(new winston.transports.File({ filename: 'error.log' })).add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  winston.add(new winston.transports.MongoDB({ db: process.env.DATABASE_LOCAL, level: 'error' }));
};
