import express from 'express';
import { UserService } from '../services/UserService';
import { ExpenseService } from '../services/ExpenseService';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();
const userService = new UserService();
const expenseService = new ExpenseService();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.login(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Add a new expense (protected route)
router.post('/expenses', AuthMiddleware.validateToken, async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    const user = (req as any).user;
    const expense = await expenseService.addExpense(user.id, amount, category, description);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all expenses for a user (protected route)
router.get('/expenses', AuthMiddleware.validateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const expenses = await expenseService.getExpenses(user.id);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;