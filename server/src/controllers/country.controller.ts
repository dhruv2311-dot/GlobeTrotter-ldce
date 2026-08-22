import { Request, Response, NextFunction } from 'express';
import * as countryService from '../services/country.service';
import { sendSuccess } from '../utils/response.util';

export async function getCountries(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const countries = await countryService.listCountries();
    sendSuccess(res, {
      message: 'Countries retrieved successfully',
      data: countries,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCountry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    const country = await countryService.getCountryById(id);
    sendSuccess(res, {
      message: 'Country retrieved successfully',
      data: country,
    });
  } catch (err) {
    next(err);
  }
}
