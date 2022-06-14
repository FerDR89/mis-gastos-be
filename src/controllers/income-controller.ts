import { Income } from "../models/income";

async function findAllIncomes(userId: string) {
  const results = await Income.findAllIncomes(userId);
  if (results === null) {
    return null;
  }
  const allUserIncomes = results.map((snap) => {
    const data = snap.data();
    return { income: data.income, incomeId: data.incomeId };
  });
  return allUserIncomes;
}

const createNewIncome = async (income: number, userId: string) => {
  const newIncome = await Income.createNewIncome(income, userId);
  if (newIncome === null) {
    return null;
  }
  return newIncome;
};

const updateIncome = async (incomeId: string, updatedIncome: number) => {
  const existIncome = await new Income(incomeId);
  await existIncome.pull();
  existIncome.data.income = updatedIncome;
  existIncome.data.updatedAt = new Date();
  await existIncome.push();
  return existIncome;
};

const deleteIncome = async (incomeId: string) => {
  const deletedIncome = Income.deleteIncome(incomeId);
  if (deletedIncome === null) {
    return null;
  }
  return true;
};

export { findAllIncomes, createNewIncome, updateIncome, deleteIncome };
