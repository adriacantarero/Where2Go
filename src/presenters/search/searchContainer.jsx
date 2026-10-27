import { connect } from "react-redux";
import { SearchPresenter } from "./searchPresenter";

// Import action creators (Thunks)
import { searchCityAction } from "/src/app/features/search/searchThunks";
import { searchPlacesAction, clearSelectionAction } from "/src/app/features/dashboard/dashboardThunks";

// Import slice actions
import { setDestinationCity, setDepartureDate, setReturnDate, clearSearch, setTitle, } from '/src/app/features/search/searchSlice';
import { clearResults } from "/src/app/features/dashboard/resultSlice";
import { createItinerary } from "/src/app/features/itinerary/itinerarySlice";
import { snapshotHomeSearch } from "/src/app/features/search/searchSlice";

function SearchContainer(props) {
    // Pass redux-props to presenter
    return <SearchPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    // We need data from the search slice
    const { params, results } = state.search;
    return {
        to: params.destinationCity,
        depart: params.departureDate,
        ret: params.returnDate,
        itineraryTitle: params.title,

        searchOptions: results.options,
        searchError: results.error,
        isLoading: (results.currentQuery && results.options === null),
    };
}

// Map Redux-actions to Props
function mapDispatch(dispatch) {
    return {
        // Params setters for the search form
        setTo: (city) => dispatch(setDestinationCity(city)),
        setDepart: (date) => dispatch(setDepartureDate(date)),
        setReturn: (date) => dispatch(setReturnDate(date)),
        setItineraryTitle: (title) => dispatch(setTitle(title)),

        snapshotHomeSearch: () => dispatch(snapshotHomeSearch()),
        
        // Create the itinerary for each search.
        onCreateItinerary: (trip) => dispatch(createItinerary(trip)),
        
        // Search actions
        doSearch: (text) => dispatch(searchCityAction(text)),
        clearSearch: () => dispatch(clearSearch()), // To close dropdown on selection

        // Handler to start the trip
        onPlanTrip: (cityObj) => {
            const offset = 0.05;
            const bounds = `${cityObj.lon - offset},${cityObj.lat - offset},${cityObj.lon + offset},${cityObj.lat + offset}`;
            
            // Clean up previous dashboard state
            dispatch(clearResults()); 
            dispatch(clearSelectionAction());
            
            // Start the places search
            dispatch(searchPlacesAction(bounds));
        }
    };
}

// Sync presenter with Redux state
export const Search = connect(mapState, mapDispatch)(SearchContainer);
