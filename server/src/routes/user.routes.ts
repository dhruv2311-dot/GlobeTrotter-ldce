import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

// Apply authMiddleware to all profile routes
router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);
router.patch('/me/password', validate(changePasswordSchema), userController.changePassword);
router.delete('/me', userController.deleteProfile);

export default router;
