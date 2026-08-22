import request from 'supertest';
import { createApp } from '../../src/app';
import { Application } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// 404 / Not Found Middleware Tests — Sprint 1
// ─────────────────────────────────────────────────────────────────────────────

let app: Application;

beforeAll(() => {
  app = createApp();
});

describe('Unknown routes — 404 handling', () => {
  it('should return 404 for GET /api/unknown', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });

  it('should return success: false', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.body.success).toBe(false);
  });

  it('should include a NOT_FOUND error code', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.body.error?.code).toBe('NOT_FOUND');
  });

  it('should return 404 for POST to unknown path', async () => {
    const res = await request(app).post('/api/nonexistent');
    expect(res.status).toBe(404);
  });

  it('should return 404 for root path without /api prefix', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});
