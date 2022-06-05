const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../../models/userModel');
const Rental = require('../../models/rentalModel');

let server;
describe('/api/returns', () => {
  let token;
  let customerId;
  let movieId;
  let rental;
  beforeEach(async () => {
    server = require('../../server');
    const user = new User();
    token = user.generateAuthToken(user._id);
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    rental = new Rental({
      customer: {
        _id: customerId,
        isGold: true,
        username: 'tester',
        phone: '123456',
      },
      movie: {
        _id: movieId,
        title: 'a',
        genre: {
          name: 'Action',
        },
        numberInStock: 5,
        dailyRentalRate: 1,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await Rental.deleteMany({});
    await server.close();
  });
  describe('POST /', () => {
    it('should return status code 401 if client is not logged in', async () => {
      token = '';
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.status).toBe(401);
    });
    it('should return status code 400 if customerId is not provided', async () => {
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ movieId });
      expect(res.status).toBe(400);
    });
    it('should return status code 400 if movieId is not provided', async () => {
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId });
      expect(res.status).toBe(400);
    });
    it('should return status code 404 if no rental is found for this customer and movie', async () => {
      const newCustomerId = mongoose.Types.ObjectId();
      const newMovieId = mongoose.Types.ObjectId();
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId: newCustomerId, movieId: newMovieId });
      expect(res.status).toBe(404);
    });
    it('should return status code 400 if rental is already processed', async () => {
      rental.dateReturned = new Date();
      await rental.save();
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.status).toBe(400);
    });
    it('should return status code 201 if it is valid request', async () => {
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.status).toBe(201);
    });
    it('should set the return date', async () => {
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.body.dateReturned).toBeDefined();
    });
    it('should calculate the rental fee', async () => {
      rental.dateOut = moment().subtract(7, 'days').toDate();
      await rental.save();
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.body.rentalFee).toBe(7);
    });
    it('should increase the stock', async () => {
      await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      const foundRental = await Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
      });
      expect(foundRental.movie.numberInStock).toBe(++rental.movie.numberInStock);
    });
    it('should return the return object in the body of the response', async () => {
      const res = await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
      expect(res.body).toMatchObject({ customerId, movieId });
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateReturned', 'rentalFee']));
    });
  });
});
