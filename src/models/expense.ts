import { firestore } from "../lib/firestore";

const collection = firestore.collection("expense");

class Expense {
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

  static async createNewExpense(expense: number, userId: string) {
    try {
      const newExpenseSnap = await collection.add({
        expense,
        userId,
        createAt: new Date(),
      });
      const newExpense = new Expense(newExpenseSnap.id);
      const expenseId = newExpense.id;
      newExpense.data = {
        expense,
        userId,
        createAt: new Date(),
        expenseId,
      };
      await newExpense.push();
      return newExpense;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteExpense(expenseId: string) {
    try {
      await collection.doc(expenseId).delete();
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async findAllExpenses(userId: string) {
    try {
      const allUserExpenses = await collection
        .where("userId", "==", userId)
        .get();
      if (allUserExpenses.empty) {
        return null;
      }
      return allUserExpenses.docs;
    } catch (error) {
      console.log(error);
    }
  }
}

export { Expense };
