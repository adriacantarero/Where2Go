import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "/src/firebaseConfig";
import { USER_COLLECTION } from "./constants";

/*
Handles user-specific persistence logic.
*/
export function fetchUserData(uid) {
    // Reference to the specific user document.
    const ref = doc(db, USER_COLLECTION, uid);
    return getDoc(ref).then(snapshot => {
        // If user doesn't exist yet, return empty object
        return snapshot.exists() ? snapshot.data() : {};
    });
}

// Create the doc on login
export function initUser(uid) {
    const ref = doc(db, USER_COLLECTION, uid);
    return setDoc(ref, { lastLogin: Date.now() }, { merge: true });
}