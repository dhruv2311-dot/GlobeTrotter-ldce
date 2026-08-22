import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import { sendSuccess, sendNoContent } from '../utils/response.util';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/AppError';

export async function getProfile(
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
      message: 'User profile retrieved successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const user = await userService.updateProfile(req.user.id, req.body);
    sendSuccess(res, {
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    sendSuccess(res, {
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    await userService.deleteUser(req.user.id);
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}
