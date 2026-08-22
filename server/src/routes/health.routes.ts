import { Router } from 'express';
import { getHealth, getDatabaseHealthCheck } from '../controllers/health.controller';

// ─────────────────────────────────────────────────────────────────────────────
// Health Routes — Sprint 1
//
//   GET /api/health     → Application health (always fast)
//   GET /api/health/db  → Database connectivity check
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

router.get('/', getHealth);
router.get('/db', getDatabaseHealthCheck);

export default router;
