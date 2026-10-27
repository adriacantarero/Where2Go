import { doc, setDoc } from "firebase/firestore";
import { db } from "/src/firebaseConfig";
import { USER_COLLECTION } from "./constants";

/*
Handles the persistence of user trips to Firestore.
*/
export function persistTrips(uid, tripsList) {
    const ref = doc(db, USER_COLLECTION, uid);
    
    // merge: true so we don't accidentally delete the user's info
    return setDoc(ref, { itineraries: tripsList }, { merge: true });
}