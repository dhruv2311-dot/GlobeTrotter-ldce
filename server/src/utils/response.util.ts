import { Response } from 'express';
import { ApiResponse, ResponseMeta } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Standard response helpers — all controllers should use these instead of
// calling res.json() directly, to guarantee a consistent response envelope.
// ─────────────────────────────────────────────────────────────────────────────

export function sendSuccess<T>(
  res: Response,
  options: {
    statusCode?: number;
    message?: string;
    data?: T;
    meta?: ResponseMeta;
  } = {}
): void {
  const { statusCode = 200, message = 'Request successful', data, meta } = options;

  const body: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;

  res.status(statusCode).json(body);
}

export function sendCreated<T>(
  res: Response,
  options: {
    message?: string;
    data?: T;
  } = {}
): void {
  sendSuccess(res, { statusCode: 201, message: 'Resource created successfully', ...options });
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
