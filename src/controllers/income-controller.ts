import { Income } from "../models/income";

type AllUserIncomes = {
  income: number;
  incomeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}[];

async function findAllIncomes(userId: string): Promise<{}[]> {
  const results = await Income.findAllIncomes(userId);
  if (results === null) {
    return null;
  }
  const allUserIncomes = results.map((snap) => {
    const data = snap.data();

    let finalData = {
      income: data.income,
      incomeId: data.incomeId,
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

  return allUserIncomes;
}

const createNewIncome = async (
  income: number,
  userId: string,
  type: string
): Promise<Income> => {
  const newIncome = await Income.createNewIncome(income, userId, type);
  if (newIncome === null) {
    return null;
  }
  return newIncome;
};

const updateIncome = async (
  incomeId: string,
  updatedIncome: number,
  updatedIncomeType: string
): Promise<Income> => {
  const existIncome = await new Income(incomeId);
  await existIncome.pull();
  existIncome.data.income = updatedIncome;
  existIncome.data.type = updatedIncomeType;
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
