import request from 'supertest';
import app from './backend.js';

describe('GET /books', () => {
  it('should return a list of books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
