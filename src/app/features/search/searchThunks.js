import { searchCities } from "/src/app/models/searchModel";
import { setSearchQuery, setSearchResults, setSearchError } from './searchSlice';

/*
Orchestrates the fetching call to the city search API.
*/
export function searchCityAction(text) {
    return function (dispatch, getState) {
        // If input is empty or too short, do not fetch
        if (!text || text.length <= 2) {
            dispatch(setSearchResults([]));
            return;
        }
        
        // Set loading state
        dispatch(setSearchQuery(text));

        // Call API model
        searchCities(text)
            .then(d => {
                // Race condition check
                if (getState().search.results.currentQuery === text) { 
                    dispatch(setSearchResults(d));
                }
            })
            .catch(e => {
                // Error handling
                if (getState().search.results.currentQuery === text) {
                    dispatch(setSearchError(e.toString()));
                }
            });        
    };
}