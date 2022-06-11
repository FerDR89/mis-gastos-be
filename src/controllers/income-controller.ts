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

export { findAllIncomes };
