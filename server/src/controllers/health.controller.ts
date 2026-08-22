import { Request, Response, NextFunction } from 'express';
import { getAppHealth, getDatabaseHealth } from '../services/health.service';
import { sendSuccess } from '../utils/response.util';

// ─────────────────────────────────────────────────────────────────────────────
// Health Controller — Sprint 1
//
// Handles GET /api/health and GET /api/health/db.
// Controllers are kept thin — all logic is delegated to the service layer.
// ─────────────────────────────────────────────────────────────────────────────

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getAppHealth();
    sendSuccess(res, {
      message: 'GlobeTrotter API is running',
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getDatabaseHealthCheck(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getDatabaseHealth();
    const statusCode = data.connected ? 200 : 503;

    res.status(statusCode).json({
      success: data.connected,
      message: data.connected
        ? 'Database connection is healthy'
        : 'Database connection failed',
      data,
    });
  } catch (err) {
    next(err);
  }
}
