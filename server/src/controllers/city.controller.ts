import { Request, Response, NextFunction } from 'express';
import * as cityService from '../services/city.service';
import { sendSuccess } from '../utils/response.util';

export async function getCities(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.query is validated and coerced by validate(listCitiesSchema)
    const { search, countryId, region, sort, page, limit } = req.query as any;

    const result = await cityService.listCities({
      search,
      countryId,
      region,
      sort,
      page,
      limit,
    });

    sendSuccess(res, {
      message: 'Cities retrieved successfully',
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    const city = await cityService.getCityById(id);
    sendSuccess(res, {
      message: 'City retrieved successfully',
      data: city,
    });
  } catch (err) {
    next(err);
  }
}
