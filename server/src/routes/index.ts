import { Router } from 'express';
import healthRouter from './health.routes';

// ─────────────────────────────────────────────────────────────────────────────
// Root API Router — Sprint 1
//
// Aggregates all feature routers under /api.
// Add future sprint routes here:
//
//   Sprint 2:  import authRouter from './auth.routes';
//              router.use('/auth', authRouter);
//
//   Sprint 2:  import usersRouter from './users.routes';
//              router.use('/users', usersRouter);
//
//   Sprint 3:  import citiesRouter from './cities.routes';
//              router.use('/cities', citiesRouter);
//
//   Sprint 4:  import tripsRouter from './trips.routes';
//              router.use('/trips', tripsRouter);
//
//   Sprint 6:  import itineraryRouter from './itinerary.routes';
//              router.use('/itinerary', itineraryRouter);
//
//   Sprint 7:  import expensesRouter from './expenses.routes';
//              router.use('/expenses', expensesRouter);
//
//   Sprint 9:  import dashboardRouter from './dashboard.routes';
//              router.use('/dashboard', dashboardRouter);
//
//   Sprint 11: import communityRouter from './community.routes';
//              router.use('/community', communityRouter);
//
//   Sprint 12: import adminRouter from './admin.routes';
//              router.use('/admin', adminRouter);
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

// Sprint 1
router.use('/health', healthRouter);

export default router;
