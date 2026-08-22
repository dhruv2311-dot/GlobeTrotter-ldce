// ─────────────────────────────────────────────────────────────────────────────
// Test Setup
//
// Loaded before all tests via Jest's `setupFiles` config.
// Sets environment variables required by the app without a real .env file.
// ─────────────────────────────────────────────────────────────────────────────

process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '0'; // Use a random port to avoid conflicts
process.env['DATABASE_URL'] =
  process.env['DATABASE_URL'] ??
  'postgresql://postgres:password@localhost:5432/globetrotter_test?schema=public';
process.env['ALLOWED_ORIGINS'] = 'http://localhost:5173';
