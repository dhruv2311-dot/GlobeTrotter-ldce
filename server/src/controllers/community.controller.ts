import { NextFunction, Response } from 'express';
import * as service from '../services/community.service';
import { AuthenticatedRequest } from '../types';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/response.util';

const uid = (req: AuthenticatedRequest) => req.user!.id;
export async function createPost(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendCreated(res, { message: 'Community post created successfully', data: await service.createPost(uid(req), req.body) }); } catch (error) { next(error); } }
export async function listPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const result = await service.listPosts(req.query); sendSuccess(res, { message: 'Community posts retrieved successfully', data: result.items, meta: result.meta }); } catch (error) { next(error); } }
export async function getPost(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendSuccess(res, { message: 'Community post retrieved successfully', data: await service.getPost(Number(req.params.postId)) }); } catch (error) { next(error); } }
export async function updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { sendSuccess(res, { message: 'Community post updated successfully', data: await service.updatePost(uid(req), Number(req.params.postId), req.body) }); } catch (error) { next(error); } }
export async function deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { await service.deletePost(uid(req), Number(req.params.postId), req.user!.role === 'ADMIN'); sendNoContent(res); } catch (error) { next(error); } }
