import { onAuthStateChanged } from "firebase/auth";
import { auth } from "/src/firebaseConfig";

// Redux actions
import { setUser, setSessionMode } from "/src/app/features/auth/authSlice";
import { setReady } from "/src/app/features/core/coreSlice";
import { loadSavedItineraries } from "/src/app/features/itinerary/itinerarySlice";

// Data model functions (Persistence)
import { fetchUserData, initUser } from "/src/app/models/authModel";

/*
Initializes the Firebase Authentication listener.
*/
export function initAuthListener(dispatch) {
    
    function loginOrOutACB(user) {
        // CASE: Logged Out
        if (!user) {
            dispatch(setUser(null));
            // Clear previous user data to prevent stale data
            dispatch(loadSavedItineraries([])); 
            // Mark app as ready (hides suspense view)
            dispatch(setReady(true));
            return;
        }

        // CASE: Logged In
        const uid = user.uid;
        dispatch(setUser(
        {
            uid: uid,
            email: user.email
        }
        ));

        // Enter auth mode
        dispatch(setSessionMode("auth"));

        // Fetch user data from db
        fetchUserData(uid)
            .then((data) => {
                // Extract itineraries
                const trips = data?.itineraries || [];
                
                // Sync db info with Redux state
                dispatch(loadSavedItineraries(trips));
                
                // Update 'lastLogin' in background
                initUser(uid);
            })
            .catch((err) => {
                console.error("Failed to load user data from Firestore:", err);
            })
            .finally(() => {
                dispatch(setReady(true));
            });
    }
    // Returns the unsubscribe function for cleanup
    return onAuthStateChanged(auth, loginOrOutACB);
}