import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { UnauthorizedError } from '../errors/AppError';
import { AuthenticatedRequest, UserPayload } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// JWT Authentication Middleware
//
// Verifies the incoming Bearer token in the Authorization header.
// On success, attaches the user payload { id, email, role } to req.user.
// On failure, routes to the central error handler with an UnauthorizedError.
// ─────────────────────────────────────────────────────────────────────────────

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Authentication token is required'));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication token must use Bearer scheme'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Authentication token is missing'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
    
    // Attach the authenticated user payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Authentication token has expired'));
    }
    return next(new UnauthorizedError('Invalid or malformed authentication token'));
  }
}
