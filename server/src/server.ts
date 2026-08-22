import { createApp } from './app';
import config from './config/env';
import prisma from './config/database';
import { logger } from './utils/logger.util';

// ─────────────────────────────────────────────────────────────────────────────
// Server Bootstrap
//
// This file:
//   1. Creates the Express app.
//   2. Starts listening on the configured port.
//   3. Handles graceful shutdown on SIGTERM / SIGINT.
// ─────────────────────────────────────────────────────────────────────────────

const serverLogger = logger.child('Server');

async function bootstrap(): Promise<void> {
  const app = createApp();
  const { port, nodeEnv } = config.app;

  // Verify database connectivity on startup (non-fatal — server still starts)
  try {
    await prisma.$connect();
    serverLogger.info('Database connection established');
  } catch (err) {
    serverLogger.warn('Could not connect to database on startup — continuing anyway', { err });
  }

  const server = app.listen(port, () => {
    serverLogger.info(`🚀 GlobeTrotter API server started`);
    serverLogger.info(`   Environment : ${nodeEnv}`);
    serverLogger.info(`   Port        : ${port}`);
    serverLogger.info(`   URL         : http://localhost:${port}`);
    serverLogger.info(`   Health      : http://localhost:${port}/api/health`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  async function shutdown(signal: string): Promise<void> {
    serverLogger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      serverLogger.info('HTTP server closed');
      await prisma.$disconnect();
      serverLogger.info('Database disconnected');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown stalls
    setTimeout(() => {
      serverLogger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  // ── Unhandled Rejections / Exceptions ──────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    serverLogger.error('Unhandled Promise Rejection', { reason });
    // In production, exit so the process manager restarts cleanly
    if (config.app.isProduction) process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    serverLogger.error('Uncaught Exception — shutting down', { message: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
