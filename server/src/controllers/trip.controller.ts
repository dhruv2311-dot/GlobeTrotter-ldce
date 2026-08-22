import { NextFunction, Response } from 'express';
import * as tripService from '../services/trip.service';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/AppError';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/response.util';

const userId = (req: AuthenticatedRequest) => { if (!req.user) throw new UnauthorizedError('Not authenticated'); return req.user.id; };
const id = (req: AuthenticatedRequest, key: string) => Number(req.params[key]);
const ok = (res: Response, message: string, data: unknown) => sendSuccess(res, { message, data });

export async function createTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Trip created successfully', data: await tripService.createTrip(userId(req), req.body) }); } catch (error) { next(error); } }
export async function listTrips(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Trips retrieved successfully', await tripService.listTrips(userId(req), req.query.status as string)); } catch (error) { next(error); } }
export async function getTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Trip retrieved successfully', await tripService.getTrip(userId(req), id(req, 'id'))); } catch (error) { next(error); } }
export async function updateTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Trip updated successfully', await tripService.updateTrip(userId(req), id(req, 'id'), req.body)); } catch (error) { next(error); } }
export async function deleteTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await tripService.deleteTrip(userId(req), id(req, 'id')); sendNoContent(res); } catch (error) { next(error); } }
export async function createStop(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Stop created successfully', data: await tripService.createStop(userId(req), id(req, 'id'), req.body) }); } catch (error) { next(error); } }
export async function listStops(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Stops retrieved successfully', await tripService.listStops(userId(req), id(req, 'id'))); } catch (error) { next(error); } }
export async function getStop(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Stop retrieved successfully', await tripService.getStop(userId(req), id(req, 'id'), id(req, 'stopId'))); } catch (error) { next(error); } }
export async function updateStop(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Stop updated successfully', await tripService.updateStop(userId(req), id(req, 'id'), id(req, 'stopId'), req.body)); } catch (error) { next(error); } }
export async function deleteStop(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await tripService.deleteStop(userId(req), id(req, 'id'), id(req, 'stopId')); sendNoContent(res); } catch (error) { next(error); } }
export async function reorderStops(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Stops reordered successfully', await tripService.reorderStops(userId(req), id(req, 'id'), req.body.stopIds)); } catch (error) { next(error); } }
export async function createDay(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Itinerary day created successfully', data: await tripService.createDay(userId(req), id(req, 'id'), req.body) }); } catch (error) { next(error); } }
export async function listDays(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Itinerary days retrieved successfully', await tripService.listDays(userId(req), id(req, 'id'))); } catch (error) { next(error); } }
export async function getDay(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Itinerary day retrieved successfully', await tripService.getDay(userId(req), id(req, 'id'), id(req, 'dayId'))); } catch (error) { next(error); } }
export async function updateDay(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Itinerary day updated successfully', await tripService.updateDay(userId(req), id(req, 'id'), id(req, 'dayId'), req.body)); } catch (error) { next(error); } }
export async function deleteDay(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await tripService.deleteDay(userId(req), id(req, 'id'), id(req, 'dayId')); sendNoContent(res); } catch (error) { next(error); } }
export async function addActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Activity added to itinerary successfully', data: await tripService.addActivity(userId(req), id(req, 'id'), id(req, 'dayId'), req.body) }); } catch (error) { next(error); } }
export async function updateActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Trip activity updated successfully', await tripService.updateActivity(userId(req), id(req, 'id'), req.body)); } catch (error) { next(error); } }
export async function deleteActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await tripService.deleteActivity(userId(req), id(req, 'id')); sendNoContent(res); } catch (error) { next(error); } }
export async function reorderActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Activities reordered successfully', await tripService.reorderActivities(userId(req), req.body.tripDayId, req.body.activityIds)); } catch (error) { next(error); } }
export async function itinerary(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { ok(res, 'Complete itinerary retrieved successfully', await tripService.itinerary(userId(req), id(req, 'id'))); } catch (error) { next(error); } }
