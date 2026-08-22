import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors/AppError';

// ─────────────────────────────────────────────────────────────────────────────
// Validation Middleware Factory
//
// Usage in route files:
//
//   import { validate } from '../middlewares/validate.middleware';
//   import { createTripSchema } from '../validators/trip.validator';
//
//   router.post('/', validate(createTripSchema), tripController.create);
//
// The schema should be a Zod object with optional `body`, `query`, `params`
// keys matching the corresponding Express request properties.
// ─────────────────────────────────────────────────────────────────────────────

interface RequestSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export function validate(schema: RequestSchema | AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Detect whether we received a plain Zod object or a { body, query, params } shape
      if ('body' in schema || 'query' in schema || 'params' in schema) {
        const s = schema as RequestSchema;
        if (s.body) req.body = await s.body.parseAsync(req.body);
        if (s.query) req.query = await s.query.parseAsync(req.query);
        if (s.params) req.params = await s.params.parseAsync(req.params);
      } else {
        // Treat the schema as a body validator
        req.body = await (schema as AnyZodObject).parseAsync(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ValidationError('Validation failed', details));
      } else {
        next(err);
      }
    }
  };
}
