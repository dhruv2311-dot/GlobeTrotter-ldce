import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalEnvNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${raw}`);
  }
  return parsed;
}

// ─── Config Object ────────────────────────────────────────────────────────────

const config = {
  app: {
    nodeEnv: optionalEnv('NODE_ENV', 'development'),
    port: optionalEnvNumber('PORT', 5000),
    isDevelopment: optionalEnv('NODE_ENV', 'development') === 'development',
    isProduction: optionalEnv('NODE_ENV', 'development') === 'production',
    isTest: optionalEnv('NODE_ENV', 'development') === 'test',
  },

  database: {
    url: requireEnv('DATABASE_URL'),
  },

  cors: {
    allowedOrigins: optionalEnv(
      'ALLOWED_ORIGINS',
      'http://localhost:5173,http://localhost:3000'
    )
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  rateLimit: {
    windowMs: optionalEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 min
    max: optionalEnvNumber('RATE_LIMIT_MAX', 100),
  },

  jwt: {
    secret: optionalEnv('JWT_SECRET', 'default-globetrotter-super-secret-jwt-key'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  },
} as const;

export default config;
export type AppConfig = typeof config;
