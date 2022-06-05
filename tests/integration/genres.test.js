const request = require('supertest');
const mongoose = require('mongoose');
const Genre = require('../../models/genreModel');
const User = require('../../models/userModel');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../server');
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
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
    let token;
    let name;
    beforeEach(() => {
      const user = new User();
      token = user.generateAuthToken(user._id);
      name = 'genre1';
    });
    const exec = async () => {
      return await request(server).post('/api/genres').set('x-auth-token', token).send({ name });
    };
    it('should return status code 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it('should return status code 400 if genre name is less than 5 characters', async () => {
      name = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should save the genre if it is valid', async () => {
      await exec();
      const foundGenre = await Genre.findOne({ name: 'genre1' });
      expect(foundGenre).not.toBeNull();
    });
    it('should return the genre if it is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
  describe('PUT /:id', () => {
    it('should return status code 404 if the genre with the given ID is not found', async () => {
      const id = mongoose.Types.ObjectId().toString();
      const res = await request(server).put(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
    it('should return status code 400 if genre name is less than 5 characters', async () => {
      const g = await Genre.collection.insertOne({ name: 'genre1' });
      const res = await request(server).put(`/api/genres/${g.insertedId.toString()}`).send({ name: 'a' });
      expect(res.status).toBe(400);
    });
    it('should return an updated genre if req body is valid', async () => {
      const g = await Genre.collection.insertOne({ name: 'genre1' });
      const res = await request(server).put(`/api/genres/${g.insertedId.toString()}`).send({ name: 'genre2' });
      expect(res.body).toHaveProperty('name', 'genre2');
    });
  });
  describe('DELETE /:id', () => {
    it('should return status code 404 if the genre with the given ID is not found', async () => {
      const id = mongoose.Types.ObjectId().toString();
      const res = await request(server).delete(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
    it('should return status code 204 if the genre is deleted', async () => {
      const g = await Genre.collection.insertOne({ name: 'genre1' });
      const res = await request(server).delete(`/api/genres/${g.insertedId.toString()}`);
      expect(res.status).toBe(204);
    });
  });
});
