import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { createApp } from '../../src/app';
import config from '../../src/config/env';
import prisma from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    trip: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    tripStop: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    tripDay: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    tripActivity: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    city: { findUnique: jest.fn() },
    activity: { findUnique: jest.fn() },
    $transaction: jest.fn((queries) => Promise.all(queries)),
  },
}));

const app = createApp();
const token = jwt.sign({ id: 1, email: 'owner@example.com', role: Role.USER }, config.jwt.secret);
const auth = { Authorization: `Bearer ${token}` };
const trip = { id: 10, userId: 1, name: 'Europe Adventure', startDate: new Date('2099-09-01'), endDate: new Date('2099-09-12'), visibility: 'PRIVATE', _count: { stops: 0 } };

describe('Sprint 3 Trip APIs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requires authentication for trip creation', async () => {
    const response = await request(app).post('/api/trips').send({ name: 'Trip', startDate: '2099-09-01', endDate: '2099-09-02' });
    expect(response.status).toBe(401);
  });

  it('rejects invalid trip date ranges', async () => {
    const response = await request(app).post('/api/trips').set(auth).send({ name: 'Trip', startDate: '2099-09-03', endDate: '2099-09-01' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('creates a trip using the authenticated user as owner', async () => {
    (prisma.trip.create as jest.Mock).mockResolvedValue(trip);
    const response = await request(app).post('/api/trips').set(auth).send({ userId: 999, name: trip.name, startDate: '2099-09-01', endDate: '2099-09-12' });
    expect(response.status).toBe(201);
    expect((prisma.trip.create as jest.Mock).mock.calls[0][0].data.userId).toBe(1);
    expect((prisma.trip.create as jest.Mock).mock.calls[0][0].data).not.toHaveProperty('userId', 999);
  });

  it('lists only the authenticated user trips with computed status', async () => {
    (prisma.trip.findMany as jest.Mock).mockResolvedValue([trip]);
    const response = await request(app).get('/api/trips').set(auth);
    expect(response.status).toBe(200);
    expect(response.body.data[0].status).toBe('UPCOMING');
    expect((prisma.trip.findMany as jest.Mock).mock.calls[0][0].where).toEqual({ userId: 1 });
  });

  it('prevents access to another users trip', async () => {
    (prisma.trip.findFirst as jest.Mock).mockResolvedValue(null);
    const response = await request(app).get('/api/trips/10').set(auth);
    expect(response.status).toBe(404);
  });

  it('updates and deletes an owned trip', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    (prisma.tripStop.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.tripDay.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.trip.update as jest.Mock).mockResolvedValue({ ...trip, name: 'Updated' });
    let response = await request(app).patch('/api/trips/10').set(auth).send({ name: 'Updated' });
    expect(response.status).toBe(200);
    response = await request(app).delete('/api/trips/10').set(auth);
    expect(response.status).toBe(204);
    expect(prisma.trip.delete).toHaveBeenCalledWith({ where: { id: 10 } });
  });
});
