import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendCreated, sendSuccess } from '../utils/response.util';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/AppError';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.register(req.body);
    sendCreated(res, {
      message: 'Registration successful',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    sendSuccess(res, {
      message: 'Login successful',
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const user = await authService.getMeById(req.user.id);
    sendSuccess(res, {
      message: 'Current user profile retrieved successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
