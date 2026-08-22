import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../errors/AppError';
import { ErrorCode } from '../types';
import { logger } from '../utils/logger.util';
import config from '../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// Central Error Middleware
//
// All errors thrown inside route handlers bubble up here.
// We distinguish:
//   - AppError      → operational, known errors with a specific HTTP status
//   - ZodError      → validation failures from Zod schemas
//   - Prisma errors → mapped to appropriate AppErrors (added in future sprints)
//   - Unknown       → 500 Internal Server Error
// ─────────────────────────────────────────────────────────────────────────────

const errorLogger = logger.child('ErrorMiddleware');

// Helper: map a Prisma error code to an AppError
function mapPrismaError(err: { code?: string; message: string }): AppError {
  switch (err.code) {
    case 'P2002':
      return new AppError('A record with this value already exists.', 409, ErrorCode.ALREADY_EXISTS);
    case 'P2025':
      return new AppError('Record not found.', 404, ErrorCode.NOT_FOUND);
    case 'P2003':
      return new AppError('Related record not found.', 400, ErrorCode.BAD_REQUEST);
    default:
      return new AppError('Database operation failed.', 500, ErrorCode.DATABASE_ERROR);
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── ZodError (validation) ──────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const appErr = new ValidationError('Validation failed', formatted);
    res.status(400).json({
      success: false,
      message: appErr.message,
      error: {
        code: appErr.code,
        details: formatted,
      },
    });
    return;
  }

  // ── Prisma errors ─────────────────────────────────────────────────────────
  if (
    err !== null &&
    typeof err === 'object' &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string' &&
    (err as { code: string }).code.startsWith('P')
  ) {
    const prismaErr = err as { code: string; message: string };
    const appErr = mapPrismaError(prismaErr);
    errorLogger.warn('Prisma error', { code: prismaErr.code });
    res.status(appErr.statusCode).json({
      success: false,
      message: appErr.message,
      error: { code: appErr.code },
    });
    return;
  }

  // ── Known operational AppError ─────────────────────────────────────────────
  if (err instanceof AppError) {
    if (!err.isOperational) {
      errorLogger.error('Non-operational AppError', { stack: err.stack });
    } else {
      errorLogger.warn(`AppError: ${err.message}`, { code: err.code, status: err.statusCode });
    }

    const body: Record<string, unknown> = {
      success: false,
      message: err.message,
      error: { code: err.code },
    };

    if (err.details) {
      (body['error'] as Record<string, unknown>)['details'] = err.details;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // ── Unknown / unexpected error ─────────────────────────────────────────────
  const unknownErr = err instanceof Error ? err : new Error(String(err));
  errorLogger.error('Unhandled error', { message: unknownErr.message, stack: unknownErr.stack });

  res.status(500).json({
    success: false,
    message: config.app.isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : unknownErr.message,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      ...(config.app.isDevelopment && { stack: unknownErr.stack }),
    },
  });
}
