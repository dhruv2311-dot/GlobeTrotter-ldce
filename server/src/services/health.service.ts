import config from '../config/env';
import { pingDatabase } from '../repositories/health.repository';
import { HealthStatus, DatabaseHealthStatus } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Health Service — Sprint 1
//
// Business logic for health-check endpoints.
// Separating this from the controller keeps the controller thin and the
// business logic independently testable.
// ─────────────────────────────────────────────────────────────────────────────

export async function getAppHealth(): Promise<HealthStatus> {
  return {
    environment: config.app.nodeEnv,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}

export async function getDatabaseHealth(): Promise<DatabaseHealthStatus> {
  return pingDatabase();
}
