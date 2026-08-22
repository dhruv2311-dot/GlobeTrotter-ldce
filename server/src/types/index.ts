// ─────────────────────────────────────────────────────────────────────────────
// GlobeTrotter — Shared Application Types
// ─────────────────────────────────────────────────────────────────────────────

// ─── Standard API Response ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  details?: unknown;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

// ─── Error Codes ──────────────────────────────────────────────────────────────

export enum ErrorCode {
  // 400
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // 401
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 403
  FORBIDDEN = 'FORBIDDEN',

  // 404
  NOT_FOUND = 'NOT_FOUND',

  // 409
  CONFLICT = 'CONFLICT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // 429
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // 500
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export interface HealthStatus {
  environment: string;
  uptime?: number;
  timestamp?: string;
}

export interface DatabaseHealthStatus {
  connected: boolean;
  latencyMs?: number;
  error?: string;
}
