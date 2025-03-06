import { BaseService } from "./BaseService";

export class ExpenseService extends BaseService {
  // Add a new expense
  async addExpense(userId: number, amount: number, category: string, description?: string) {
    const expense = await this.prisma.expense.create({
      data: {
        amount,
        category,
        description,
        userId,
      },
    });
    return expense;
  }

  // Get all expenses for a user
  async getExpenses(userId: number) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
    })
    return expenses;
  }
}