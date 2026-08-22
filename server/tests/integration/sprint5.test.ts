import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { createApp } from '../../src/app';
import config from '../../src/config/env';
import prisma from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    communityPost: { create: jest.fn(), count: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    trip: { findUnique: jest.fn() },
    user: { count: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    tripStop: { groupBy: jest.fn() },
    city: { count: jest.fn(), findMany: jest.fn() },
    activity: { count: jest.fn(), findMany: jest.fn() },
    tripActivity: { groupBy: jest.fn() },
    $transaction: jest.fn((queries) => Promise.all(queries)),
  },
}));

const app = createApp();
const token = (id: number, role: Role) => jwt.sign({ id, email: `${id}@example.com`, role }, config.jwt.secret);
const userAuth = { Authorization: `Bearer ${token(1, Role.USER)}` };
const adminAuth = { Authorization: `Bearer ${token(2, Role.ADMIN)}` };
const author = { id: 1, firstName: 'Test', lastName: 'User', profilePhoto: null };
const post = { id: 3, userId: 1, tripId: null, title: 'Paris', content: 'Great trip', image: null, createdAt: new Date(), updatedAt: new Date(), user: author, trip: null };

describe('Sprint 5 Community and Admin APIs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requires authentication to create a community post', async () => {
    expect((await request(app).post('/api/community/posts').send({ title: 'x', content: 'y' })).status).toBe(401);
  });

  it('creates a post using the authenticated owner', async () => {
    (prisma.communityPost.create as jest.Mock).mockResolvedValue(post);
    const response = await request(app).post('/api/community/posts').set(userAuth).send({ userId: 99, title: 'Paris', content: 'Great trip' });
    expect(response.status).toBe(201);
    expect((prisma.communityPost.create as jest.Mock).mock.calls[0][0].data.userId).toBe(1);
  });

  it('lists posts with pagination and safe author fields', async () => {
    (prisma.communityPost.count as jest.Mock).mockResolvedValue(1);
    (prisma.communityPost.findMany as jest.Mock).mockResolvedValue([post]);
    const response = await request(app).get('/api/community/posts?search=paris&page=1&limit=20');
    expect(response.status).toBe(200);
    expect(response.body.data[0].author.email).toBeUndefined();
    expect(response.body.meta.total).toBe(1);
  });

  it('blocks normal users from admin APIs', async () => {
    expect((await request(app).get('/api/admin/stats').set(userAuth)).status).toBe(403);
  });

  it('allows admins to list users without password hashes', async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(1);
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 1, firstName: 'Test', lastName: 'User', username: 'test', email: 'test@example.com', role: Role.USER, isActive: true, isEmailVerified: true, createdAt: new Date(), updatedAt: new Date(), _count: { trips: 1, communityPosts: 0 } }]);
    const response = await request(app).get('/api/admin/users').set(adminAuth);
    expect(response.status).toBe(200);
    expect(response.body.data[0].passwordHash).toBeUndefined();
  });

  it('requires admin authentication for admin APIs', async () => {
    expect((await request(app).get('/api/admin/stats')).status).toBe(401);
  });
});
