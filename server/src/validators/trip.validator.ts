import { z } from 'zod';

export const listActivitiesSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    cityId: z
      .string()
      .regex(/^\d+$/, 'cityId must be an integer')
      .transform(Number)
      .optional(),
    type: z.string().trim().optional(),
    minCost: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'minCost must be a valid number')
      .transform(Number)
      .refine((val) => val >= 0, 'minCost must be greater than or equal to 0')
      .optional(),
    maxCost: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'maxCost must be a valid number')
      .transform(Number)
      .refine((val) => val >= 0, 'maxCost must be greater than or equal to 0')
      .optional(),
    maxDuration: z
      .string()
      .regex(/^\d+$/, 'maxDuration must be an integer')
      .transform(Number)
      .refine((val) => val >= 0, 'maxDuration must be greater than or equal to 0')
      .optional(),
    sort: z
      .enum(['name', 'cost_asc', 'cost_desc', 'duration_asc', 'duration_desc'], {
        errorMap: () => ({
          message: 'Invalid sort parameter. Allowed values: name, cost_asc, cost_desc, duration_asc, duration_desc',
        }),
      })
      .optional(),
    page: z
      .string()
      .regex(/^\d+$/, 'page must be an integer')
      .transform(Number)
      .refine((val) => val > 0, 'page must be greater than 0')
      .optional()
      .default('1'),
    limit: z
      .string()
      .regex(/^\d+$/, 'limit must be an integer')
      .transform(Number)
      .refine((val) => val > 0 && val <= 100, 'limit must be between 1 and 100')
      .optional()
      .default('20'),
  }),
});

export const getActivityByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be an integer')
      .transform(Number),
  }),
});

const date = z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date');
const id = z.string().regex(/^\d+$/, 'ID must be an integer').transform(Number);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format');
const dateRange = (schema: z.ZodRawShape) => z.object(schema).refine((value: any) => !value.startDate || !value.endDate || value.endDate >= value.startDate, { path: ['endDate'], message: 'endDate cannot be before startDate' });

export const createTripSchema = z.object({ body: dateRange({
  name: z.string().trim().min(1).max(150), description: z.string().trim().max(5000).optional(), coverPhoto: z.string().url().optional(),
  startDate: date, endDate: date, visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
}) });
export const updateTripSchema = z.object({ params: z.object({ id }), body: dateRange({
  name: z.string().trim().min(1).max(150).optional(), description: z.string().trim().max(5000).optional(), coverPhoto: z.string().url().optional(),
  startDate: date.optional(), endDate: date.optional(), visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
}) });
export const tripIdSchema = z.object({ params: z.object({ id }) });
export const listTripsSchema = z.object({ query: z.object({ status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED']).optional() }) });
export const createStopSchema = z.object({ params: z.object({ id }), body: dateRange({ cityId: id, startDate: date, endDate: date, notes: z.string().trim().max(5000).optional() }) });
export const updateStopSchema = z.object({ params: z.object({ id, stopId: id }), body: dateRange({ cityId: id.optional(), startDate: date.optional(), endDate: date.optional(), notes: z.string().trim().max(5000).optional() }) });
export const stopParamsSchema = z.object({ params: z.object({ id, stopId: id }) });
export const reorderStopsSchema = z.object({ params: z.object({ id }), body: z.object({ stopIds: z.array(id).min(1) }).refine((value) => new Set(value.stopIds).size === value.stopIds.length, 'stopIds must not contain duplicates') });
export const createDaySchema = z.object({ params: z.object({ id }), body: z.object({ date, title: z.string().trim().max(150).optional(), notes: z.string().trim().max(5000).optional() }) });
export const updateDaySchema = z.object({ params: z.object({ id, dayId: id }), body: z.object({ date: date.optional(), title: z.string().trim().max(150).optional(), notes: z.string().trim().max(5000).optional() }) });
export const dayParamsSchema = z.object({ params: z.object({ id, dayId: id }) });
export const addTripActivitySchema = z.object({ params: z.object({ id, dayId: id }), body: z.object({ activityId: id, startTime: time.optional(), endTime: time.optional(), customCost: z.number().min(0).optional(), notes: z.string().trim().max(5000).optional() }).refine((value) => !value.startTime || !value.endTime || value.endTime >= value.startTime, { path: ['endTime'], message: 'endTime cannot be before startTime' }) });
export const tripActivityParamsSchema = z.object({ params: z.object({ id }) });
export const updateTripActivitySchema = z.object({ params: z.object({ id }), body: z.object({ startTime: time.optional(), endTime: time.optional(), customCost: z.number().min(0).nullable().optional(), notes: z.string().trim().max(5000).nullable().optional(), sequence: z.number().int().positive().optional() }).refine((value) => !value.startTime || !value.endTime || value.endTime >= value.startTime, { path: ['endTime'], message: 'endTime cannot be before startTime' }) });
export const reorderActivitiesSchema = z.object({ body: z.object({ tripDayId: id, activityIds: z.array(id).min(1) }).refine((value) => new Set(value.activityIds).size === value.activityIds.length, 'activityIds must not contain duplicates') });
