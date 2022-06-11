import { firestore } from "../lib/firestore";
import { isAfter } from "date-fns";
const collection = firestore.collection("auth");

class Auth {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    await this.ref.update(this.data);
  }

  static async findByEmail(email: string) {
    try {
      const results = await collection.where("email", "==", email).get();
      if (results.empty) {
        return null;
      } else {
        const firstMatch = results.docs[0];
        const newAuth = new Auth(firstMatch.id);
        newAuth.data = firstMatch.data();
        return newAuth;
      }
    } catch (e) {
      console.error(e);
    }
  }

  isCodeExpire() {
    const now = new Date();
    // .toDate() es un método propio de Firestore que convierte el objeto expires (_seconds y _nanoseconds) en una fecha
    const expires = this.data.expires.toDate();
    return isAfter(now, expires);
  }

  static async findByEmailAndCode(email: string, code: number) {
    try {
      const results = await collection
        .where("email", "==", email)
        .where("code", "==", code)
        .get();
      if (results.empty) {
        return null;
      } else {
        const firstMatch = results.docs[0];
        const newAuth = new Auth(firstMatch.id);
        newAuth.data = firstMatch.data();
        return newAuth;
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }
}
export { Auth };
