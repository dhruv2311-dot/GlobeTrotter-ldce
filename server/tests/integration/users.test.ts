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
      update: jest.fn(),
    },
  },
}));

const app = createApp();

describe('Users Profile Integration Tests', () => {
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

  let token: string;

  beforeAll(() => {
    token = jwt.sign(
      { id: mockUser.id, email: mockUser.email, role: mockUser.role },
      config.jwt.secret
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/me', () => {
    it('should retrieve profile successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(mockUser.id);
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Verify secret field omitted
    });
  });

  describe('PATCH /api/users/me', () => {
    it('should update profile fields successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        firstName: 'Johnny',
        city: 'London',
      });

      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Johnny', city: 'London' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe('Johnny');
      expect(res.body.data.user.city).toBe('London');
    });

    it('should block updating role or other internal fields', async () => {
      // Zod schema ignores or rejects unexpected parameters (or controller filters them out since they are not in UpdateProfileInput interface)
      // If we attempt to send them, they should not trigger updates to these fields.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'ADMIN', passwordHash: 'hijacked' });

      // Check what prisma update was called with
      const updateCall = (prisma.user.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.data.role).toBeUndefined();
      expect(updateCall.data.passwordHash).toBeUndefined();
    });
  });

  describe('PATCH /api/users/me/password', () => {
    it('should change password successfully when current password matches', async () => {
      const currentPassword = 'OldPassword123!';
      const newPassword = 'NewPassword123!';
      const hash = await bcrypt.hash(currentPassword, 10);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .patch('/api/users/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword, newPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.user.update as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when current password is wrong', async () => {
      const hash = await bcrypt.hash('OldPassword123!', 10);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });

      const res = await request(app)
        .patch('/api/users/me/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'wrong-current-password', newPassword: 'NewPassword123!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('BAD_REQUEST');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should soft-delete/deactivate user profile returning 204 no content', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      const res = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
      expect(prisma.user.update as jest.Mock).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { isActive: false },
      });
    });
  });
});
