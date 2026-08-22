import request from 'supertest';
import { createApp } from '../../src/app';
import prisma from '../../src/config/database';

// Mock the database client singleton
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    country: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    city: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  },
}));

const app = createApp();

describe('Countries & Cities Integration Tests', () => {
  const mockCountry = { id: 1, name: 'France', code: 'FR' };
  const mockCity = {
    id: 10,
    name: 'Paris',
    region: 'Europe',
    description: 'City of light',
    costIndex: 5,
    popularityScore: 4.9,
    countryId: 1,
    country: mockCountry,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/countries', () => {
    it('should list all countries successfully', async () => {
      (prisma.country.findMany as jest.Mock).mockResolvedValue([mockCountry]);

      const res = await request(app).get('/api/countries');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('France');
    });

    it('should fetch a single country by ID', async () => {
      (prisma.country.findUnique as jest.Mock).mockResolvedValue(mockCountry);

      const res = await request(app).get('/api/countries/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('France');
    });

    it('should return 404 for missing country', async () => {
      (prisma.country.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/countries/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/cities', () => {
    it('should list cities with paginated format metadata', async () => {
      (prisma.city.count as jest.Mock).mockResolvedValue(1);
      (prisma.city.findMany as jest.Mock).mockResolvedValue([mockCity]);

      const res = await request(app).get('/api/cities?page=1&limit=20');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should execute filtering and searching queries successfully', async () => {
      (prisma.city.count as jest.Mock).mockResolvedValue(1);
      (prisma.city.findMany as jest.Mock).mockResolvedValue([mockCity]);

      const res = await request(app).get(
        '/api/cities?search=par&countryId=1&region=Europe&sort=popularity'
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.city.findMany as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should validate query parameters and throw error on invalid value', async () => {
      const res = await request(app).get('/api/cities?sort=invalid_sort');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fetch a single city by ID containing country detail', async () => {
      (prisma.city.findUnique as jest.Mock).mockResolvedValue(mockCity);

      const res = await request(app).get('/api/cities/10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Paris');
      expect(res.body.data.country.name).toBe('France');
    });

    it('should return 404 for missing city ID', async () => {
      (prisma.city.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/cities/999');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
