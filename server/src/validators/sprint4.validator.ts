import { z } from 'zod';

const id = z.string().regex(/^\d+$/, 'ID must be an integer').transform(Number);
const date = z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date');
const currency = z.string().regex(/^[A-Za-z]{3}$/, 'Currency must be a 3-letter code').transform((value) => value.toUpperCase());
const tripId = z.object({ tripId: id });

export const tripBudgetParamsSchema = tripId;
export const budgetSchema = z.object({ amount: z.number().positive(), currency });
export const addExpenseSchema = z.object({ params: tripId, body: z.object({ category: z.enum(['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER']), amount: z.number().positive(), currency, date, description: z.string().trim().max(5000).optional(), tripStopId: id.optional(), tripActivityId: id.optional() }) });
export const expenseParamsSchema = z.object({ params: z.object({ tripId: id, expenseId: id }), body: z.object({ category: z.enum(['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER']).optional(), amount: z.number().positive().optional(), currency: currency.optional(), date: date.optional(), description: z.string().trim().max(5000).nullable().optional(), tripStopId: id.nullable().optional(), tripActivityId: id.nullable().optional() }).optional() });
export const expenseQuerySchema = z.object({ params: tripId, query: z.object({ category: z.enum(['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER']).optional(), date: date.optional() }) });
export const savedCitySchema = z.object({ params: z.object({ cityId: id }) });
export const shareParamsSchema = z.object({ params: z.object({ shareSlug: z.string().min(10).max(80) }) });
