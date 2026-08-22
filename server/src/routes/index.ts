import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import countryRouter from './country.routes';
import cityRouter from './city.routes';
import activityRouter from './activity.routes';
import tripRouter, { tripActivityRouter } from './trip.routes';
import { publicRouter, savedRouter, tripRouter as sprint4TripRouter } from './sprint4.routes';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as dashboardController from '../controllers/sprint4.controller';
import communityRouter from './community.routes';
import adminRouter from './admin.routes';

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
router.use('/trips', sprint4TripRouter);
router.use('/users', savedRouter);
router.use('/public', publicRouter);
router.get('/dashboard', authMiddleware, dashboardController.dashboard);
router.use('/community', communityRouter);
router.use('/admin', adminRouter);

export default router;
