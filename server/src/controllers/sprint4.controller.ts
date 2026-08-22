import { NextFunction, Response } from 'express';
import config from '../config/env';
import * as service from '../services/sprint4.service';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../errors/AppError';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/response.util';

const uid = (req: AuthenticatedRequest) => { if (!req.user) throw new UnauthorizedError('Not authenticated'); return req.user.id; };
const numberParam = (req: AuthenticatedRequest, name: string) => Number(req.params[name]);
const success = (res: Response, message: string, data: unknown) => sendSuccess(res, { message, data });

export async function setBudget(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Trip budget updated successfully', await service.updateBudget(uid(req), numberParam(req, 'tripId'), req.body)); } catch (e) { next(e); } }
export async function createExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Expense created successfully', data: await service.createExpense(uid(req), numberParam(req, 'tripId'), req.body) }); } catch (e) { next(e); } }
export async function listExpenses(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Expenses retrieved successfully', await service.listExpenses(uid(req), numberParam(req, 'tripId'), req.query)); } catch (e) { next(e); } }
export async function getExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Expense retrieved successfully', await service.getExpense(uid(req), numberParam(req, 'tripId'), numberParam(req, 'expenseId'))); } catch (e) { next(e); } }
export async function updateExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Expense updated successfully', await service.updateExpense(uid(req), numberParam(req, 'tripId'), numberParam(req, 'expenseId'), req.body)); } catch (e) { next(e); } }
export async function deleteExpense(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await service.deleteExpense(uid(req), numberParam(req, 'tripId'), numberParam(req, 'expenseId')); sendNoContent(res); } catch (e) { next(e); } }
export async function budget(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Budget summary retrieved successfully', await service.budget(uid(req), numberParam(req, 'tripId'))); } catch (e) { next(e); } }
export async function dailyBudget(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Daily budget retrieved successfully', await service.dailyBudget(uid(req), numberParam(req, 'tripId'))); } catch (e) { next(e); } }
export async function calendar(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Calendar retrieved successfully', await service.calendar(uid(req), numberParam(req, 'tripId'))); } catch (e) { next(e); } }
export async function dashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Dashboard retrieved successfully', await service.dashboard(uid(req))); } catch (e) { next(e); } }
export async function saveDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Destination saved successfully', data: await service.saveDestination(uid(req), numberParam(req, 'cityId')) }); } catch (e) { next(e); } }
export async function listSavedDestinations(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Saved destinations retrieved successfully', await service.listSavedDestinations(uid(req))); } catch (e) { next(e); } }
export async function deleteSavedDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await service.deleteSavedDestination(uid(req), numberParam(req, 'cityId')); sendNoContent(res); } catch (e) { next(e); } }
export async function shareTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Trip shared successfully', await service.shareTrip(uid(req), numberParam(req, 'tripId'), config.app.frontendUrl)); } catch (e) { next(e); } }
export async function disableShare(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await service.disableShare(uid(req), numberParam(req, 'tripId')); sendNoContent(res); } catch (e) { next(e); } }
export async function publicTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { success(res, 'Public trip retrieved successfully', await service.publicTrip(String(req.params.shareSlug))); } catch (e) { next(e); } }
export async function copyTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Trip copied successfully', data: await service.copyTrip(uid(req), String(req.params.shareSlug)) }); } catch (e) { next(e); } }
