import prisma from '../config/database';
import { DatabaseHealthStatus } from '../types';
import { logger } from '../utils/logger.util';

// ─────────────────────────────────────────────────────────────────────────────
// Health Repository — Sprint 1
//
// Provides data-access operations needed by the health service.
// The only operation is pinging the database to verify connectivity.
// ─────────────────────────────────────────────────────────────────────────────

const healthLogger = logger.child('HealthRepository');

export async function pingDatabase(): Promise<DatabaseHealthStatus> {
  const start = Date.now();
  try {
    // $queryRaw is the lightest possible DB round-trip
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    healthLogger.debug(`DB ping succeeded in ${latencyMs}ms`);
    return { connected: true, latencyMs };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    healthLogger.error('DB ping failed', { error });
    return { connected: false, error };
  }
}
