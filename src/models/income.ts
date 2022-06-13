import { firestore } from "../lib/firestore";

const collection = firestore.collection("incomes");

class Income {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id) {
    (this.id = id), (this.ref = collection.doc(id));
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    await this.ref.update(this.data);
  }

  static async createNewIncome(income: number, userId: string) {
    try {
      const newIncomeSnap = await collection.add({
        income,
        userId,
        createAt: new Date(),
      });
      const newIncome = new Income(newIncomeSnap.id);
      const incomeId = newIncome.id;
      newIncome.data = {
        income,
        userId,
        createAt: new Date(),
        incomeId,
      };
      await newIncome.push();
      return newIncome;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async findAllIncomes(userId: string) {
    try {
      const allUserIncomes = await collection
        .where("userId", "==", userId)
        .get();
      if (allUserIncomes.empty) {
        return null;
      }
      return allUserIncomes.docs;
    } catch (error) {
      console.log(error);
    }
  }
}

export { Income };
