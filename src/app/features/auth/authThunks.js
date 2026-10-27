//Auth imports
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "/src/firebaseConfig";
import { setAuthError } from "/src/app/features/auth/authSlice";

/*
Handles the side-effect of opening the Google sign in popup.
*/
export function loginWithGoogle() {
    return async (dispatch) => {
        try {
            const provider = new GoogleAuthProvider();
            // Trigger firebase popup
            await signInWithPopup(auth, provider);
        } catch (err) {
            dispatch(setAuthError(err.message));
        }
    };
}