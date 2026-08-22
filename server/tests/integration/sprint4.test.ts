import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { createApp } from '../../src/app';
import config from '../../src/config/env';
import prisma from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    trip: { findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    tripExpense: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), aggregate: jest.fn(), groupBy: jest.fn(), update: jest.fn(), delete: jest.fn() },
    tripStop: { findFirst: jest.fn() },
    tripActivity: { findUnique: jest.fn() },
    city: { findUnique: jest.fn(), findMany: jest.fn() },
    savedDestination: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), delete: jest.fn() },
    tripShare: { findUnique: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const app = createApp();
const auth = { Authorization: `Bearer ${jwt.sign({ id: 1, email: 'owner@example.com', role: Role.USER }, config.jwt.secret)}` };
const trip = { id: 1, userId: 1, startDate: new Date('2099-09-01'), endDate: new Date('2099-09-03'), budgetAmount: 10000, budgetCurrency: 'INR' };

describe('Sprint 4 Budget and Sharing APIs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requires authentication for budget access', async () => {
    expect((await request(app).get('/api/trips/1/budget')).status).toBe(401);
  });

  it('sets a trip budget for its owner', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    (prisma.trip.update as jest.Mock).mockResolvedValue({ ...trip, budgetAmount: 10000 });
    const response = await request(app).patch('/api/trips/1/budget').set(auth).send({ amount: 10000, currency: 'inr' });
    expect(response.status).toBe(200);
    expect((prisma.trip.update as jest.Mock).mock.calls[0][0].data).toEqual({ budgetAmount: 10000, budgetCurrency: 'INR' });
  });

  it('rejects expenses outside trip dates', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    const response = await request(app).post('/api/trips/1/expenses').set(auth).send({ category: 'MEAL', amount: 20, currency: 'INR', date: '2099-09-10' });
    expect(response.status).toBe(400);
  });

  it('calculates budget totals and category breakdown', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    (prisma.tripExpense.aggregate as jest.Mock).mockResolvedValue({ _sum: { amount: 7500 } });
    (prisma.tripExpense.groupBy as jest.Mock).mockResolvedValue([{ category: 'MEAL', _sum: { amount: 2500 } }, { category: 'STAY', _sum: { amount: 5000 } }]);
    const response = await request(app).get('/api/trips/1/budget').set(auth);
    expect(response.status).toBe(200);
    expect(response.body.data.summary.remaining).toBe(2500);
    expect(response.body.data.categoryBreakdown.MEAL).toBe(2500);
  });

  it('rejects unauthenticated trip copying', async () => {
    expect((await request(app).post('/api/public/trips/a-valid-share-slug/copy')).status).toBe(401);
  });

  it('rejects invalid public share slugs', async () => {
    const response = await request(app).get('/api/public/trips/short');
    expect(response.status).toBe(400);
  });
});
