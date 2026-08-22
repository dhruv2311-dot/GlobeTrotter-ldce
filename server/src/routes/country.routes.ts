import { Router } from 'express';
import * as countryController from '../controllers/country.controller';
import { validate } from '../middlewares/validate.middleware';
import { getCountryByIdSchema } from '../validators/city.validator';

const router = Router();

router.get('/', countryController.getCountries);
router.get('/:id', validate(getCountryByIdSchema), countryController.getCountry);

export default router;
