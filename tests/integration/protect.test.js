const request = require('supertest');
const User = require('../../models/userModel');
let server;
describe('protect middleware', () => {
  let token;
  beforeEach(() => {
    server = require('../../server');
    const user = new User();
    token = user.generateAuthToken(user._id);
  });
  afterEach(async () => {
    await server.close();
  });
  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await request(server).get('/api/users/me').set('x-auth-token', token);
    expect(res.status).toBe(401);
  });
  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await request(server).get('/api/users/me').set('x-auth-token', token);
    expect(res.status).toBe(400);
  });
  it('should return 200 if token is valid', async () => {
    const res = await request(server).get('/api/users/me').set('x-auth-token', token);
    expect(res.status).toBe(200);
  });
});
