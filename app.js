const express = require('express');
const helmet = require('helmet');
const homeRouter = require('./routes/homeRouter');
const genreRouter = require('./routes/genreRouter');
const customerRouter = require('./routes/customerRouter');
const movieRouter = require('./routes/movieRouter');
const rentalRouter = require('./routes/rentalRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const handleError = require('./middleware/handleError');
const logging = require('./logging');
const app = express();

logging();

// throw new Error('I am refactoring code so I m testing it now. Sorry for this inconvenience');
// Promise.reject(new Error('I m refactoring code so it will better then'));

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
