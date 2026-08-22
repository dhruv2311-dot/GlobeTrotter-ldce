import { Router } from 'express';
import * as controller from '../controllers/sprint4.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { addExpenseSchema, budgetSchema, expenseParamsSchema, expenseQuerySchema, savedCitySchema, shareParamsSchema, tripBudgetParamsSchema } from '../validators/sprint4.validator';

const tripRouter = Router();
tripRouter.use(authMiddleware);
tripRouter.patch('/:tripId/budget', validate({ params: tripBudgetParamsSchema, body: budgetSchema }), controller.setBudget);
tripRouter.post('/:tripId/expenses', validate(addExpenseSchema), controller.createExpense);
tripRouter.get('/:tripId/expenses', validate(expenseQuerySchema), controller.listExpenses);
tripRouter.get('/:tripId/expenses/:expenseId', validate(expenseParamsSchema), controller.getExpense);
tripRouter.patch('/:tripId/expenses/:expenseId', validate(expenseParamsSchema), controller.updateExpense);
tripRouter.delete('/:tripId/expenses/:expenseId', validate(expenseParamsSchema), controller.deleteExpense);
tripRouter.get('/:tripId/budget/daily', validate({ params: tripBudgetParamsSchema }), controller.dailyBudget);
tripRouter.get('/:tripId/budget', validate({ params: tripBudgetParamsSchema }), controller.budget);
tripRouter.get('/:tripId/calendar', validate({ params: tripBudgetParamsSchema }), controller.calendar);
tripRouter.post('/:tripId/share', validate({ params: tripBudgetParamsSchema }), controller.shareTrip);
tripRouter.delete('/:tripId/share', validate({ params: tripBudgetParamsSchema }), controller.disableShare);

const savedRouter = Router();
savedRouter.use(authMiddleware);
savedRouter.post('/me/saved-destinations/:cityId', validate(savedCitySchema), controller.saveDestination);
savedRouter.get('/me/saved-destinations', controller.listSavedDestinations);
savedRouter.delete('/me/saved-destinations/:cityId', validate(savedCitySchema), controller.deleteSavedDestination);

const publicRouter = Router();
publicRouter.get('/trips/:shareSlug', validate(shareParamsSchema), controller.publicTrip);
publicRouter.post('/trips/:shareSlug/copy', authMiddleware, validate(shareParamsSchema), controller.copyTrip);

export { tripRouter, savedRouter, publicRouter };
