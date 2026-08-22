import { z } from 'zod';

export const listCitiesSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    countryId: z
      .string()
      .regex(/^\d+$/, 'countryId must be an integer')
      .transform(Number)
      .optional(),
    region: z.string().trim().optional(),
    sort: z
      .enum(['popularity', 'name', 'cost_asc', 'cost_desc'], {
        errorMap: () => ({ message: 'Invalid sort parameter. Allowed values: popularity, name, cost_asc, cost_desc' }),
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

export const getCityByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be an integer')
      .transform(Number),
  }),
});

export const getCountryByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be an integer')
      .transform(Number),
  }),
});
