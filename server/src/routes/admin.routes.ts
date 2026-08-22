import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { adminStatusSchema, adminUserIdSchema, adminUsersSchema } from '../validators/sprint5.validator';

const router = Router();
router.use(authMiddleware, requireRole(Role.ADMIN));
router.get('/users', validate(adminUsersSchema), controller.listUsers);
router.get('/users/:userId', validate(adminUserIdSchema), controller.getUser);
router.patch('/users/:userId/status', validate(adminStatusSchema), controller.setUserStatus);
router.get('/stats', controller.stats);
router.get('/popular-cities', controller.popularCities);
router.get('/popular-activities', controller.popularActivities);
router.get('/engagement', controller.engagement);
router.get('/trends', controller.trends);
export default router;
