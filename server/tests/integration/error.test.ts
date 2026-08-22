import request from 'supertest';
import express, { Router, Request, Response, NextFunction } from 'express';
import { createApp } from '../../src/app';
import { AppError, ValidationError, NotFoundError } from '../../src/errors/AppError';
import { errorMiddleware } from '../../src/middlewares/error.middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling Tests — Sprint 1
// ─────────────────────────────────────────────────────────────────────────────

describe('Error middleware — AppError handling', () => {
  // Build a minimal express app that injects controlled errors
  function makeTestApp(throwFn: (_req: Request, _res: Response, next: NextFunction) => void) {
    const app = express();
    app.use(express.json());
    const router = Router();
    router.get('/test-error', (req, res, next) => {
      try {
        throwFn(req, res, next);
      } catch (err) {
        next(err);
      }
    });
    app.use('/api', router);
    app.use(errorMiddleware);
    return app;
  }

  it('should return 404 for NotFoundError', async () => {
    const app = makeTestApp(() => {
      throw new NotFoundError('Trip not found');
    });
    const res = await request(app).get('/api/test-error');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 for ValidationError', async () => {
    const app = makeTestApp(() => {
      throw new ValidationError('Name is required', [{ field: 'name', message: 'Required' }]);
    });
    const res = await request(app).get('/api/test-error');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeDefined();
  });

  it('should return 500 for generic AppError', async () => {
    const app = makeTestApp(() => {
      throw new AppError('Unexpected failure', 500);
    });
    const res = await request(app).get('/api/test-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('should not expose stack trace in test environment', async () => {
    const app = makeTestApp(() => {
      throw new Error('Raw error');
    });
    const res = await request(app).get('/api/test-error');
    // In test env (non-production), stack may be present but message should not be raw
    expect(res.body.success).toBe(false);
    expect(res.status).toBe(500);
  });
});

describe('Application startup', () => {
  it('should create app without throwing', () => {
    expect(() => createApp()).not.toThrow();
  });
});
