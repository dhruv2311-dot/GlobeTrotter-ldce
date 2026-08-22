import request from 'supertest';
import { createApp } from '../../src/app';
import prisma from '../../src/config/database';

// Mock the database client singleton
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    activity: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  },
}));

const app = createApp();

describe('Activities Integration Tests', () => {
  const mockActivity = {
    id: 50,
    cityId: 10,
    name: 'Eiffel Tower Guided Tour',
    description: 'Ascend the tower',
    type: 'sightseeing',
    estimatedCost: 3500.0,
    durationMinutes: 120,
    city: {
      id: 10,
      name: 'Paris',
      country: {
        id: 1,
        name: 'France',
        code: 'FR',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/activities', () => {
    it('should list activities with pagination metadata successfully', async () => {
      (prisma.activity.count as jest.Mock).mockResolvedValue(1);
      (prisma.activity.findMany as jest.Mock).mockResolvedValue([mockActivity]);

      const res = await request(app).get('/api/activities?page=1&limit=20');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBe(1);
    });

    it('should execute filtering by city, type, cost range, max duration, and sorting', async () => {
      (prisma.activity.count as jest.Mock).mockResolvedValue(1);
      (prisma.activity.findMany as jest.Mock).mockResolvedValue([mockActivity]);

      const res = await request(app).get(
        '/api/activities?cityId=10&type=sightseeing&minCost=100&maxCost=5000&maxDuration=180&sort=cost_asc'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.activity.findMany as jest.Mock).toHaveBeenCalledTimes(1);

      // Verify that findMany query structure handles variables
      const queryOptions = (prisma.activity.findMany as jest.Mock).mock.calls[0][0];
      expect(queryOptions.where.cityId).toBe(10);
      expect(queryOptions.where.type.equals).toBe('sightseeing');
      expect(queryOptions.where.estimatedCost.gte).toBe(100);
      expect(queryOptions.where.estimatedCost.lte).toBe(5000);
      expect(queryOptions.where.durationMinutes.lte).toBe(180);
      expect(queryOptions.orderBy.estimatedCost).toBe('asc');
    });

    it('should validate invalid sort arguments returning 400', async () => {
      const res = await request(app).get('/api/activities?sort=invalid_sort');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fetch a single activity by ID with detailed association details', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);

      const res = await request(app).get('/api/activities/50');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Eiffel Tower Guided Tour');
      expect(res.body.data.city.name).toBe('Paris');
      expect(res.body.data.city.country.name).toBe('France');
    });

    it('should return 404 for nonexistent activity ID', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/activities/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
