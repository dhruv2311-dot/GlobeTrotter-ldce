import { PrismaClient } from '@prisma/client';
import config from './env';

// ─── Singleton Prisma Client ──────────────────────────────────────────────────
//
// We export a single shared PrismaClient instance.
// Do NOT create additional PrismaClient instances elsewhere — multiple instances
// will open additional connection pools and cause resource exhaustion.
//
// In test environments, the client is recreated per-suite to avoid state bleed.

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: config.app.isDevelopment
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });
}

// In development, attach the client to the global object so that Hot Module
// Replacement doesn't create a new connection pool on every file reload.
const prisma: PrismaClient =
  config.app.isProduction
    ? createPrismaClient()
    : (global.__prisma ?? (global.__prisma = createPrismaClient()));

export default prisma;
