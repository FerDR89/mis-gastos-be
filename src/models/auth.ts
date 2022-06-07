import { firestore } from "../lib/firestore"

class Auth {
    id: string;
    ref: FirebaseFirestore.DocumentReference
    constructor(id) {
        this.id = id,
            this.ref = firestore.doc(id)
    }
}

export { Auth }