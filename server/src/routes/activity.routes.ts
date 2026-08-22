import { Router } from 'express';
import * as activityController from '../controllers/activity.controller';
import { validate } from '../middlewares/validate.middleware';
import { listActivitiesSchema, getActivityByIdSchema } from '../validators/trip.validator';

const router = Router();

router.get('/', validate(listActivitiesSchema), activityController.getActivities);
router.get('/:id', validate(getActivityByIdSchema), activityController.getActivity);

export default router;
