const express = require('express');
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const helmet = require('helmet');
const homeRouter = require('./routes/homeRouter');
const genreRouter = require('./routes/genreRouter');
const customerRouter = require('./routes/customerRouter');
const movieRouter = require('./routes/movieRouter');
const rentalRouter = require('./routes/rentalRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const handleError = require('./middleware/handleError');
const app = express();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION. SHUTTING DOWN...💥');
  winston.error(err.stack);
  setTimeout(() => {
    process.exit(1);
  }, 1500);
});
process.on('unhandledRejection', () => {
  console.log('UNHANDLED REJECTION. SHUTTING DOWN...💥');
  process.exit(1);
});

winston.add(new winston.transports.File({ filename: 'error.log' })).add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
winston.add(new winston.transports.MongoDB({ db: process.env.DATABASE_LOCAL, level: 'error' }));

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use('/', homeRouter);
app.use('/api/genres', genreRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', movieRouter);
app.use('/api/rentals', rentalRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(handleError);

module.exports = app;
