import { createSlice, nanoid } from '@reduxjs/toolkit';

/*
Itinerary slice manages the user's saved trips and the active planner.
*/
const itinerarySlice = createSlice({
    name: 'itinerary',
    initialState: {
        current: {
            id: null,
            title: "",
            pois: [],
            createdAt: null,
            updatedAt: null,
            // Trip details
            tripDestination: null,
            startDate: null,
            endDate: null,
        },
        itineraries: [], // List of all trips persisted in Firestore
        error: null,
    },

    reducers: {
        // Syncs the Redux state with data loaded from Firebase
        loadSavedItineraries(state, action){
            state.itineraries = action.payload || [];
        },

        // Signals the persistenceMiddleware to save the current itinerary
        requestedSavingItinerary(state) {
        },

        // Initializes a new trip with a unique ID
        createItinerary(state, action){
            const { tripDestination, startDate, endDate, title } = action.payload || {};
            state.current = {
                id: nanoid(), // Generates a unique ID for database indexing
                title: title,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                pois: [],
                tripDestination: tripDestination || null,
                startDate: startDate || null,
                endDate: endDate || null,
            };
        },

        // Signals the persistenceMiddleware to delete the current itinerary
        requestedDeletingItinerary(state) {
        },
        
        // Adds a POI in some itinerary
        addPoiToItinerary(state, action){
            const poi = action.payload;

            // Prevent duplicates in the itinerary
            const exists = state.current.pois.some(p => p.id === poi.id);
            if(exists) return;

            // Resolve the category for display
            const category = poi.mainCategory ||
                (Array.isArray(poi.categories) && poi.categories.length > 0
                    ? poi.categories[0]
                    : "Other");

            state.current.pois.push({
                ...poi,
                category,
            });
            state.current.updatedAt = Date.now();
        },

        // Removes a POI by ID
        removePoiToItinerary(state, action){
            //creating a new array of pois with the ones that do not have the same id as the one we want to remove.
            const poiId = action.payload;
            state.current.pois = state.current.pois.filter(p => p.id !== poiId);
            state.current.updatedAt = Date.now();
        },
        
        // Updates the title of the active trip
        setCurrentItineraryTitle(state, action) {
            if (!state.current) return;

            state.current.title = action.payload;
            state.current.updatedAt = Date.now();
        },
        
        // Switches the active itinerary
        selectItinerary(state, action){
            const id = action.payload;
            const found = state.itineraries.find(it => it.id === id);
            if (!found) return;

            //We put the selected itinerary to current.
            state.current = {
                ...found,
                pois: [...(found.pois || [])],
            }; 
        },

        // Resets the planner
        clearItinerary(state){
            state.current = {
                id: null,
                title: "",
                pois: [],
                createdAt: null,
                updatedAt: null,
                tripDestination: null,
                startDate: null,
                endDate: null,
            }
        },

        // Updates the scheduled date of a POI
        updatePoiDate(state, action) {
            const { id, newDate } = action.payload;
            if (!state.current) return;

            // Find the POI and update its date
            const poi = state.current.pois.find(p => p.id === id);
            if (poi) {
                poi.visitDate = newDate;
                state.current.updatedAt = Date.now();
            }
        },
    }
});

// Export initial state
export const itineraryInitialState = itinerarySlice.getInitialState();

// Export reducer
export const itineraryReducer = itinerarySlice.reducer;

// Export actions
export const {
    loadSavedItineraries, requestedSavingItinerary, createItinerary,
    requestedDeletingItinerary, addPoiToItinerary, removePoiToItinerary,
    setCurrentItineraryTitle, selectItinerary, clearItinerary, updatePoiDate,
} = itinerarySlice.actions;