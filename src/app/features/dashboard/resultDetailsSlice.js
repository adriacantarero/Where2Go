import { createSlice } from '@reduxjs/toolkit';

/*
Result details slice manages the information shown of a specific POI.
 */
const resultDetailsSlice = createSlice({
    name: 'resultDetails',
    initialState: {
        placeId: null,      // The ID of the selected place
        details: null,      // Extended data (images, wiki info, opening hours)
        loading: false,
        error: null
    },
    reducers: {
        // Initiates the detailed fetch
        setDetailsQuery(state, action) {
            state.placeId = action.payload;
            state.details = null; // Clear old data to prevent stale UI
            state.loading = true;
            state.error = null;
        },

        // Success: Full place data retrieved
        setDetailsSuccess(state, action) {
            state.details = action.payload;
            state.loading = false;
        },

        // Error: Detail fetch failed
        setDetailsError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },

        // Reset: User closed the sidebar or clicked back
        clearDetails(state) {
            state.placeId = null;
            state.details = null;
            state.error = null;
            state.loading = false;
        }
    }
});

// Export initial state
export const resultDetailsInitialState = resultDetailsSlice.getInitialState();

// Export reducer
export const resultDetailsReducer = resultDetailsSlice.reducer;

// Export actions
export const { setDetailsQuery, setDetailsSuccess, setDetailsError, clearDetails } = resultDetailsSlice.actions;

// Export selectors
export const selectCurrentPlaceId = (state) => state.resultDetails.placeId;
export const selectDetails = (state) => state.resultDetails.details;
export const selectDetailsLoading = (state) => state.resultDetails.loading;
export const selectDetailsError = (state) => state.resultDetails.error;