import request from 'supertest';
import { createApp } from '../../src/app';
import { Application } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// Health Endpoint Tests — Sprint 1
// ─────────────────────────────────────────────────────────────────────────────

let app: Application;

beforeAll(() => {
  app = createApp();
});

describe('GET /api/health', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('should return success: true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.success).toBe(true);
  });

  it('should include a message field', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.length).toBeGreaterThan(0);
  });

  it('should include data.environment', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.data).toBeDefined();
    expect(typeof res.body.data.environment).toBe('string');
  });

  it('should include data.uptime as a number', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.data.uptime).toBe('number');
  });

  it('should include data.timestamp as an ISO string', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.data.timestamp).toBe('string');
    // Verify it is a valid ISO 8601 date string
    const parsed = Date.parse(res.body.data.timestamp);
    expect(isNaN(parsed)).toBe(false);
  });

  it('should respond in JSON', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

describe('GET /api/health/db', () => {
  it('should return either 200 or 503 (never 5xx from unhandled error)', async () => {
    const res = await request(app).get('/api/health/db');
    expect([200, 503]).toContain(res.status);
  });

  it('should include data.connected boolean', async () => {
    const res = await request(app).get('/api/health/db');
    expect(typeof res.body.data.connected).toBe('boolean');
  });

  it('should include success field matching connected status', async () => {
    const res = await request(app).get('/api/health/db');
    expect(res.body.success).toBe(res.body.data.connected);
  });
});
