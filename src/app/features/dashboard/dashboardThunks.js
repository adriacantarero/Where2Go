// API layer access
import { getPlaces, getPlaceDetails } from '/src/app/models/dashboardModel';

// Redux actions
import { setBounds, setCategories, setQuery, setResults, setError } from './resultSlice';
import { setDetailsQuery, setDetailsSuccess, setDetailsError, clearDetails } from './resultDetailsSlice';

// Redux selectors
import { selectCurrentPlaceId } from './resultDetailsSlice';
import { selectCategories, selectQuery, selectBounds } from './resultSlice';

/*
Handles the search based on active map bounds.
 */
export function searchPlacesAction(bounds) {
    return function (dispatch, getState) {
        // If no bounds, do nothing (and clear results)
        if (!bounds) {
            dispatch(setResults([]));
            return;
        }

        // Save new bounds
        dispatch(setBounds(bounds));
        
        // Select active category filter
        const currentCategories = selectCategories(getState());

        // If no categories are selected, do nothing (and clear results)
        if (!currentCategories || currentCategories.length === 0) {
            dispatch(setResults([]));
            return;
        }

        // Set loading state (triggers spinner in UI)
        dispatch(setQuery(bounds));
        
        // Call API model
        getPlaces(bounds, currentCategories)
            .then(d => {
                // race condition check: ensure map hasn't moved again while loading
                if (selectQuery(getState()) === bounds) {
                    dispatch(setResults(d));
                }
            })
            .catch(e => {
                // race condition check for errors too
                if (selectQuery(getState()) === bounds) {
                    dispatch(setError(e.toString()));
                }
            });        
    };
}

/*
Triggered when user changes the category filter in the sidebar.
*/
export function changeCategoryAction(newCategories) {
    return function (dispatch, getState) {
        // Update categories in state
        dispatch(setCategories(newCategories));

        // Get last known bounds
        const currentBounds = selectBounds(getState());

        // If we have a map location, re-run the search with new filters
        if (currentBounds) {
            // We dispatch the action above to reuse logic
            dispatch(searchPlacesAction(currentBounds));
        }
    };
}

/*
Fetches full details for a POI when a user clicks on it.
*/
export function selectPlaceAction(placeId) {
    return function (dispatch, getState) {
        // Check if we are already showing this place to avoid redundant calls
        if (selectCurrentPlaceId(getState()) === placeId) return;

        // Update State (loading)
        dispatch(setDetailsQuery(placeId));

        // Fetch full details from API
        getPlaceDetails(placeId)
            .then(details => {
                // race condition check: ensure user didn't click another place
                if (selectCurrentPlaceId(getState()) === placeId) {
                    dispatch(setDetailsSuccess(details));
                }
            })
            .catch(err => {
                // race condition check
                if (selectCurrentPlaceId(getState()) === placeId) {
                    dispatch(setDetailsError(err.toString()));
                }
            });
    };
}

/**
Logic for returning from detailsView to listView.
*/
export function clearSelectionAction() {
    return function (dispatch) {
        // Clear selection to return to list view
        dispatch(clearDetails());
    };
}