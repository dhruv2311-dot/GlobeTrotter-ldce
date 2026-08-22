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
