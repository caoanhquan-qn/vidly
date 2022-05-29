const request = require('supertest');
const Genre = require('../../models/genreModel');
const User = require('../../models/userModel');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../server');
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(2);
      expect(res.body.some((genre) => genre.name === 'genre1')).toBeTruthy();
    });
  });
  describe('GET /:id', () => {
    it('should return an genre object with the given ID', async () => {
      const g = await Genre.collection.insertOne({ name: 'genre1' });
      const res = await request(server).get(`/api/genres/${g.insertedId.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'genre1');
    });
    it('should return status code 404 if the genre with the given ID is not found', async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });
  describe('POST /', () => {
    it('should return status code 401 if client is not logged in', async () => {
      const res = await request(server).post('/api/genres').send({ name: 'genre1' });
      expect(res.status).toBe(401);
    });
    it('should return status code 400 if genre name is less than 5 characters', async () => {
      const user = new User();
      const token = user.generateAuthToken(user._id);
      const res = await request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'a' });
      expect(res.status).toBe(400);
    });
    it('should save the genre if it is valid', async () => {
      const user = new User();
      const token = user.generateAuthToken(user._id);
      const res = await request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' });
      const foundGenre = await Genre.findOne({ name: 'genre1' });
      expect(foundGenre).not.toBeNull();
    });
    it('should return the genre if it is valid', async () => {
      const user = new User();
      const token = user.generateAuthToken(user._id);
      const res = await request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
