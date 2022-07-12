import { Expense } from "../models/expense";

type AllUserExpenses = {
  expense: number;
  expenseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}[];

async function findAllExpenses(userId: string): Promise<{}[]> {
  const results = await Expense.findAllExpenses(userId);
  if (results === null) {
    return null;
  }
  const allUserExpenses: AllUserExpenses = results.map((snap) => {
    const data = snap.data();

    let finalData = {
      expense: data.expense,
      expenseId: data.expenseId,
      type: data.type,
    };

    if (data.createdAt) {
      finalData["createdAt"] = data.createdAt.toDate();
    }

    if (data.updatedAt) {
      finalData["updatedAt"] = data.updatedAt.toDate();
    }
    return finalData;
  });
  return allUserExpenses;
}

const createNewExpense = async (
  expense: number,
  userId: string,
  type: string
): Promise<Expense> => {
  const newExpense = await Expense.createNewExpense(expense, userId, type);
  if (newExpense === null) {
    return null;
  }
  return newExpense;
};

const updateExpense = async (
  expenseId: string,
  updatedExpense: number,
  updatedType: string
): Promise<Expense> => {
  const existExpense = await new Expense(expenseId);
  await existExpense.pull();
  existExpense.data.expense = updatedExpense;
  existExpense.data.type = updatedType;
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
