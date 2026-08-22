import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import countryRouter from './country.routes';
import cityRouter from './city.routes';
import activityRouter from './activity.routes';
import tripRouter, { tripActivityRouter } from './trip.routes';

// ─────────────────────────────────────────────────────────────────────────────
// Root API Router — Sprint 2
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

// Sprint 1
router.use('/health', healthRouter);

// Sprint 2
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/countries', countryRouter);
router.use('/cities', cityRouter);
router.use('/activities', activityRouter);
router.use('/trips', tripRouter);
router.use('/trip-activities', tripActivityRouter);

export default router;
