import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import { AuthenticatedRequest } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Authorization Middleware
//
// Ensures the authenticated user possesses the correct role (e.g. USER, ADMIN).
// Must be registered AFTER authMiddleware.
// ─────────────────────────────────────────────────────────────────────────────

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
}
