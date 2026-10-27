import { createSlice } from '@reduxjs/toolkit';

/*
Search Slice manages the trip planning form and city autocomplete results.
*/
const searchSlice = createSlice({
    name: 'search', 
    initialState: {
        // Active form data
        params: {
            destinationCity: null, 
            departureDate: null, 
            returnDate: null, 
            title: "",
        },
        // Buffer to preserve the home-screen search state
        homeParams: {
            destinationCity: null, 
            departureDate: null, 
            returnDate: null, 
            title: "",
        },
        // Query Results
        results: {
            currentQuery: null, options: [], error: null
        }
    },
    reducers: {
        // Form Setters
        setDestinationCity(state, action) { state.params.destinationCity = action.payload; },
        setDepartureDate(state, action) { state.params.departureDate = action.payload; },
        setReturnDate(state, action) { state.params.returnDate = action.payload; },
        setTitle(state, action) { state.params.title = action.payload },

        snapshotHomeSearch(state) { state.homeParams = { ...state.params };},
        restoreHomeSearch(state) { state.params = { ...state.homeParams };
    },
        
        // Search State Setters
        setSearchQuery(state, action) {
            state.results.currentQuery = action.payload;
            state.results.options = null;       // Set to null to indicate "Loading"
            state.results.error = null;         // clear old errors
        },
        setSearchResults(state, action) { 
            state.results.options = action.payload; 
        },
        setSearchError(state, action) { 
            state.results.error = action.payload;  
            state.results.options = []; 
        },
        clearSearch(state) {
            state.results.options = [];
            state.results.currentQuery = null;
        },
        //reset the form when logout
        resetSearch(state) {
           state.params.departureDate = null;
           state.params.destinationCity = null;
           state.params.returnDate = null;
           state.params.title = "";
        },
    }
});

// Export initial state
export const searchInitialState = searchSlice.getInitialState();

// Export the Reducer
export const searchReducer = searchSlice.reducer;

// Export the generated action creators
export const {
    setDestinationCity, setDepartureDate, setReturnDate, setTitle, snapshotHomeSearch, restoreHomeSearch,
    setSearchQuery, setSearchResults, setSearchError, clearSearch, resetSearch
} = searchSlice.actions;