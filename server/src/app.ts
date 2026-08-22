import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import config from './config/env';
import apiRouter from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { logger } from './utils/logger.util';

// ─────────────────────────────────────────────────────────────────────────────
// Express Application Factory
//
// Exporting the configured app separately from the server bootstrap allows us
// to import it in tests without actually binding to a port.
// ─────────────────────────────────────────────────────────────────────────────

const appLogger = logger.child('App');

export function createApp(): Application {
  const app = express();

  // ── Security headers ───────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        if (config.cors.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        appLogger.warn(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please slow down.',
      error: { code: 'RATE_LIMIT_EXCEEDED' },
    },
  });
  app.use('/api', limiter);

  // ── Compression ────────────────────────────────────────────────────────────
  app.use(compression());

  // ── Body parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── HTTP request logging ───────────────────────────────────────────────────
  if (!config.app.isTest) {
    const morganFormat = config.app.isDevelopment ? 'dev' : 'combined';
    app.use(morgan(morganFormat));
  }

  // ── API Routes ─────────────────────────────────────────────────────────────
  app.use('/api', apiRouter);

  // ── 404 handler (must be after all routes) ─────────────────────────────────
  app.use(notFoundMiddleware);

  // ── Central error handler (must be last) ──────────────────────────────────
  app.use(errorMiddleware);

  return app;
}
