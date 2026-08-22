import { NextFunction, Response } from 'express';
import * as service from '../services/admin.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response.util';

const result = (res: Response, message: string, data: unknown) => sendSuccess(res, { message, data });
export async function listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const data = await service.listUsers(req.query); sendSuccess(res, { message: 'Admin users retrieved successfully', data: data.items, meta: data.meta }); } catch (error) { next(error); } }
export async function getUser(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Admin user retrieved successfully', await service.getUser(Number(req.params.userId))); } catch (error) { next(error); } }
export async function setUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'User status updated successfully', await service.setUserStatus(req.user!.id, Number(req.params.userId), req.body.isActive)); } catch (error) { next(error); } }
export async function stats(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Admin statistics retrieved successfully', await service.stats()); } catch (error) { next(error); } }
export async function popularCities(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Popular cities retrieved successfully', await service.popularCities()); } catch (error) { next(error); } }
export async function popularActivities(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Popular activities retrieved successfully', await service.popularActivities()); } catch (error) { next(error); } }
export async function engagement(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Engagement statistics retrieved successfully', await service.engagement()); } catch (error) { next(error); } }
export async function trends(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { result(res, 'Trip trends retrieved successfully', await service.trends()); } catch (error) { next(error); } }
