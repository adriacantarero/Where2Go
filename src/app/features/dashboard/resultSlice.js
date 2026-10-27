import { createSlice } from '@reduxjs/toolkit';

/*
Result slice manages the list of Points of Interest (POIs) and map view state.
*/
const resultSlice = createSlice({
    name: 'result',
    initialState: {
        // Current map view parameters 
        params: {
            bounds: null,                       // minLon,minLat,maxLon,maxLat
            categories: ["tourism.sights", "entertainment.museum", "entertainment.culture", "leisure.park", "natural.mountain"],
        },
        // Current search results
        results: {
            currentQuery: null,
            poiList: null,
            loading: false,
            error: null
        },
    },
    reducers: {
        // Updates the geographical area to search in
        setBounds(state, action) { state.params.bounds = action.payload; },

        // Updates the active category filters
        setCategories(state, action) { state.params.categories = action.payload; },

        // Triggered when a search starts
        setQuery(state, action) {
            state.results.currentQuery = action.payload;
            state.results.loading = true;
            state.results.error = null;
        },

        // Success: API returned POI data
        setResults(state, action){ 
            state.results.poiList = action.payload || []; 
            state.results.loading = false;     
        },

        // Failure: API error handling
        setError(state, action){
            state.results.error = action.payload;
            state.results.loading = false;    
            if (!state.results.poiList) state.results.poiList = [];
        },

        // Reset the dashboard
        clearResults(state) {
            state.results.currentQuery = null;
            state.results.poiList = null;
            state.results.loading = false;
            state.results.error = null;
            state.params.bounds = null;
        }
    }
});

// Export initial state
export const resultsInitialState = resultSlice.getInitialState();

// Export reducer
export const resultReducer = resultSlice.reducer;

// Export actions
export const { setBounds, setCategories, setQuery, setResults, setError, clearResults } = resultSlice.actions;

// Export selectors
export const selectBounds = (state) => state.result.params.bounds;
export const selectCategories = (state) => state.result.params.categories;
export const selectQuery = (state) => state.result.results.currentQuery;
export const selectResults = (state) => state.result.results.poiList;
export const selectResultsLoading = (state) => state.result.results.loading;
export const selectResultsError = (state) => state.result.results.error;