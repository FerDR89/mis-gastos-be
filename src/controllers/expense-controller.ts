import { Expense } from "../models/expense";

async function findAllExpenses(userId: string): Promise<{}[]> {
  const results = await Expense.findAllExpenses(userId);
  if (results === null) {
    return null;
  }
  const allUserExpenses: { expense: number; expenseId: string }[] = results.map(
    (snap) => {
      const data = snap.data();
      return {
        expense: data.expense,
        expenseId: data.expenseId,
        created: data.createAt,
      };
    }
  );
  return allUserExpenses;
}

const createNewExpense = async (
  expense: number,
  userId: string
): Promise<Expense> => {
  const newExpense = await Expense.createNewExpense(expense, userId);
  if (newExpense === null) {
    return null;
  }
  return newExpense;
};

const updateExpense = async (
  expenseId: string,
  updatedIncome: number
): Promise<Expense> => {
  const existExpense = await new Expense(expenseId);
  await existExpense.pull();
  existExpense.data.expense = updatedIncome;
  existExpense.data.updatedAt = new Date();
  await existExpense.push();
  return existExpense;
};

const deleteExpense = async (expenseId: string) => {
  const deletedExpense = Expense.deleteExpense(expenseId);
  if (deletedExpense === null) {
    return null;
  }
  return true;
};

export { findAllExpenses, createNewExpense, updateExpense, deleteExpense };
