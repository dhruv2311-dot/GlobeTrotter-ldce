import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ForbiddenError, NotFoundError } from '../errors/AppError';
import { PaginatedResult } from '../types';

const authorSelect = { id: true, firstName: true, lastName: true, profilePhoto: true } as const;
const tripSelect = { id: true, name: true, description: true, coverPhoto: true, startDate: true, endDate: true, visibility: true } as const;
type PostWithRelations = Prisma.CommunityPostGetPayload<{ include: { user: { select: typeof authorSelect }; trip: { select: typeof tripSelect } } }>;

function safePost(post: PostWithRelations) {
  return { id: post.id, title: post.title, content: post.content, image: post.image, createdAt: post.createdAt, updatedAt: post.updatedAt, author: post.user, trip: post.trip?.visibility === 'PUBLIC' ? post.trip : null };
}
async function validAttachedTrip(userId: number, tripId?: number | null) {
  if (!tripId) return;
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true, visibility: true } });
  if (!trip || (trip.userId !== userId && trip.visibility !== 'PUBLIC')) throw new ForbiddenError('You cannot attach this trip to a post');
}
const include = { user: { select: authorSelect }, trip: { select: tripSelect } } as const;

export async function createPost(userId: number, input: any) { await validAttachedTrip(userId, input.tripId); const post = await prisma.communityPost.create({ data: { title: input.title, content: input.content, image: input.image, tripId: input.tripId, userId }, include }); return safePost(post); }
export async function listPosts(query: any): Promise<PaginatedResult<ReturnType<typeof safePost>>> { const { search, sort, tripId, userId, page, limit } = query; const where: Prisma.CommunityPostWhereInput = { tripId, userId, ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }] } : {}) }; const orderBy = sort === 'oldest' ? { createdAt: 'asc' as const } : sort === 'updated' ? { updatedAt: 'desc' as const } : { createdAt: 'desc' as const }; const [total, posts] = await prisma.$transaction([prisma.communityPost.count({ where }), prisma.communityPost.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include })]); return { items: posts.map(safePost), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }; }
export async function getPost(postId: number) { const post = await prisma.communityPost.findUnique({ where: { id: postId }, include }); if (!post) throw new NotFoundError(`Community post with ID ${postId} not found`); return safePost(post); }
async function ownedPost(userId: number, postId: number) { const post = await prisma.communityPost.findUnique({ where: { id: postId }, include }); if (!post) throw new NotFoundError(`Community post with ID ${postId} not found`); if (post.userId !== userId) throw new ForbiddenError('You do not own this community post'); return post; }
export async function updatePost(userId: number, postId: number, input: any) { await ownedPost(userId, postId); await validAttachedTrip(userId, input.tripId); const post = await prisma.communityPost.update({ where: { id: postId }, data: input, include }); return safePost(post); }
export async function deletePost(userId: number, postId: number, isAdmin = false) { const post = await prisma.communityPost.findUnique({ where: { id: postId }, select: { userId: true } }); if (!post) throw new NotFoundError(`Community post with ID ${postId} not found`); if (!isAdmin && post.userId !== userId) throw new ForbiddenError('You do not own this community post'); await prisma.communityPost.delete({ where: { id: postId } }); }
