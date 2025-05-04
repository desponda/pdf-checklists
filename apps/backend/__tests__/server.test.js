const request = require('supertest');
const { app } = require('../server/server');

let server;

beforeAll(() => {
  server = app.listen(0); // Use any available port
});

afterAll((done) => {
  server.close(done);
});

describe('Server API Tests', () => {
  describe('Error Handler', () => {
    it('should handle errors with appropriate response', async () => {
      const response = await request(server)
        .get('/api/non-existent-route');
      
      expect(response.status).toBe(404);
    });
  });

  describe('API Routes', () => {
    it('should have /api/files endpoint', async () => {
      const response = await request(server)
        .get('/api/files');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should have /api/generate-pdf endpoint', async () => {
      const response = await request(server)
        .post('/api/generate-pdf')
        .send({ pages: [] });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 