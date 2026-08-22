import { Router } from 'express';
import * as cityController from '../controllers/city.controller';
import { validate } from '../middlewares/validate.middleware';
import { listCitiesSchema, getCityByIdSchema } from '../validators/city.validator';

const router = Router();

router.get('/', validate(listCitiesSchema), cityController.getCities);
router.get('/:id', validate(getCityByIdSchema), cityController.getCity);

export default router;
