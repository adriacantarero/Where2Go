import { connect } from "react-redux";
import { MapPresenter } from "./mapPresenter";

// Import action creators
import { searchPlacesAction, selectPlaceAction, clearSelectionAction } from '/src/app/features/dashboard/dashboardThunks';

// Import Selectors
import { selectResults, selectResultsLoading, selectResultsError, selectCategories } from "/src/app/features/dashboard/resultSlice";
import { selectCurrentPlaceId } from "/src/app/features/dashboard/resultDetailsSlice";

function MapContainer(props) {
    // Pass redux-props to presenter
    return <MapPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    // We need data from two slices:
    
    // 1. Search Slice: To know the city the user selected
    const searchParams = state.search.params;

    // 2. Places Slice: To show the pins on the map (state.result based on rootReducer)
    const places = selectResults(state);

    return {
        // Initial destination coordinates
        destinationCity: searchParams.destinationCity,

        // Pin data
        places: places || [],
        placesError: selectResultsError(state),

        // loading state
        isLoading: selectResultsLoading(state),

        // Current search categories
        activeCategories: selectCategories(state) || [],
        selectedPlaceId: selectCurrentPlaceId(state)
    };
}

// Map Redux-actions to Props
function mapDispatch(dispatch) {
    return {
        onMapMove: (bounds) => dispatch(searchPlacesAction(bounds)),
        onMarkerClick: (placeId) => dispatch(selectPlaceAction(placeId)),
        onBackgroundClick: () => dispatch(clearSelectionAction())
    };
}
    
// Sync presenter with Redux state
export const Map = connect(mapState, mapDispatch)(MapContainer);