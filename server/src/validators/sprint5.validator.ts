import { z } from 'zod';

const id = z.string().regex(/^\d+$/, 'ID must be an integer').transform(Number);
const page = z.string().regex(/^\d+$/, 'page must be an integer').transform(Number).refine((value) => value > 0).optional().default('1');
const limit = z.string().regex(/^\d+$/, 'limit must be an integer').transform(Number).refine((value) => value > 0 && value <= 100).optional().default('20');

export const createPostSchema = z.object({ body: z.object({ title: z.string().trim().min(1).max(180), content: z.string().trim().min(1).max(10000), image: z.string().url().optional(), tripId: id.optional() }) });
export const updatePostSchema = z.object({ params: z.object({ postId: id }), body: z.object({ title: z.string().trim().min(1).max(180).optional(), content: z.string().trim().min(1).max(10000).optional(), image: z.string().url().nullable().optional(), tripId: id.nullable().optional() }) });
export const postIdSchema = z.object({ params: z.object({ postId: id }) });
export const listPostsSchema = z.object({ query: z.object({ search: z.string().trim().max(100).optional(), sort: z.enum(['latest', 'oldest', 'updated']).optional().default('latest'), tripId: id.optional(), userId: id.optional(), page, limit }) });

export const adminUsersSchema = z.object({ query: z.object({ search: z.string().trim().max(100).optional(), role: z.enum(['USER', 'ADMIN']).optional(), isActive: z.enum(['true', 'false']).transform((value) => value === 'true').optional(), page, limit }) });
export const adminUserIdSchema = z.object({ params: z.object({ userId: id }) });
export const adminStatusSchema = z.object({ params: z.object({ userId: id }), body: z.object({ isActive: z.boolean() }) });
