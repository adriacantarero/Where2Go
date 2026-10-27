import { persistTrips } from "/src/app/models/itineraryModel";
import { loadSavedItineraries, selectItinerary, clearItinerary } from "/src/app/features/itinerary/itinerarySlice";

/*
Handles the persistence layer.
*/
export const persistenceMiddleware = (store) => (next) => (action) => {
    // Let the action pass through to the reducers first
    const result = next(action);

    // Read current state and itinerary state
    const state = store.getState();
    const userId = state.auth.user?.uid;
    const { current, itineraries: saved } = state.itinerary;

    // Only persist if we have a logged-in user and a valid itinerary
    if (!userId || !current?.id) return result;

    // CASE: Save itinerary
    if (action.type === 'itinerary/requestedSavingItinerary') {
        
        // Logic: if it exists, replace it. If not, add it.
        const isExisting = saved.some(it => it.id === current.id);
        const nextSaved = isExisting
            ? saved.map(it => it.id === current.id ? current : it)
            : [...saved, current];    

        // Call persistence model
        persistTrips(userId, nextSaved)
            .then(() => {
                // Reload Redux with new list
                store.dispatch(loadSavedItineraries(nextSaved));
            })
            .catch((e) => console.error("Persistence Error (Save):", e));
    }

    // CASE: Delete itinerary
    if (action.type === 'itinerary/requestedDeletingItinerary') {
        
        // Filter out the current itinerary from the list
        const updatedList = saved.filter(it => it.id !== current.id);

        // Call persistence model
        persistTrips(userId, updatedList)
            .then(() => {
                // Reload Redux (sync)
                store.dispatch(loadSavedItineraries(updatedList));
                
                // Select the next available trip or clear if the list is now empty
                const nextItin = updatedList[0] || null;
                if (nextItin) {
                    store.dispatch(selectItinerary(nextItin.id));
                } else {
                    store.dispatch(clearItinerary());
                }
            })
            .catch((e) => console.error("Persistence Error (Delete):", e));
    }
    // Return the result for middleware chain.
    return result;
};