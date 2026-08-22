import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { createApp } from '../../src/app';
import prisma from '../../src/config/database';
import config from '../../src/config/env';

// Mock the database client singleton
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userPreference: {
      deleteMany: jest.fn(),
    },
  },
}));

const app = createApp();

describe('Auth Integration Tests', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    passwordHash: 'hashed_password',
    role: Role.USER,
    isActive: true,
    preference: {
      language: 'en',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validRegistration = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
      phone: '1234567890',
      city: 'Paris',
      country: 'France',
      bio: 'Traveler',
      language: 'en',
    };

    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validRegistration);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(mockUser.email);
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Sensitive field removed
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validRegistration, email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for weak/short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validRegistration, password: 'weak' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 409 conflict for duplicate email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validRegistration);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return access token', async () => {
      const password = 'StrongPassword123!';
      const hash = await bcrypt.hash(password, 10);
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe(mockUser.email);
    });

    it('should return 401 for incorrect password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'wrong-password' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for non-existent email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'some-password' });

      expect(res.status).toBe(401);
    });
  });

  describe('Protected endpoints auth checks', () => {
    it('should return 401 when calling protected route without JWT', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for invalid JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-value');

      expect(res.status).toBe(401);
    });

    it('should return 200 for valid JWT and return user profile info', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const token = jwt.sign(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        config.jwt.secret
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(mockUser.email);
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });
  });
});
