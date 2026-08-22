import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Not-Found Middleware
//
// Registered AFTER all routes. Any request that reaches this handler did not
// match any registered route.
// ─────────────────────────────────────────────────────────────────────────────

export function notFoundMiddleware(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: {
      code: ErrorCode.NOT_FOUND,
    },
  });
}
