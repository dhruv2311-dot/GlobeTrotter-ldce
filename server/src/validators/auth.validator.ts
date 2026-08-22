// ─────────────────────────────────────────────────────────────────────────────
// Auth Validators — Sprint 2
//
// Zod schemas for authentication endpoints will be implemented in Sprint 2.
// ─────────────────────────────────────────────────────────────────────────────

// Example (to be implemented in Sprint 2):
//
// import { z } from 'zod';
//
// export const registerSchema = z.object({
//   body: z.object({
//     firstName: z.string().min(1).max(50),
//     lastName: z.string().min(1).max(50),
//     email: z.string().email(),
//     password: z.string().min(8),
//   }),
// });
//
// export const loginSchema = z.object({
//   body: z.object({
//     email: z.string().email(),
//     password: z.string().min(1),
//   }),
// });
