import { Request, Response, NextFunction } from 'express';
import * as activityService from '../services/activity.service';
import { sendSuccess } from '../utils/response.util';

export async function getActivities(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, cityId, type, minCost, maxCost, maxDuration, sort, page, limit } = req.query as any;

    const result = await activityService.listActivities({
      search,
      cityId,
      type,
      minCost,
      maxCost,
      maxDuration,
      sort,
      page,
      limit,
    });

    sendSuccess(res, {
      message: 'Activities retrieved successfully',
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    const activity = await activityService.getActivityById(id);
    sendSuccess(res, {
      message: 'Activity retrieved successfully',
      data: activity,
    });
  } catch (err) {
    next(err);
  }
}
