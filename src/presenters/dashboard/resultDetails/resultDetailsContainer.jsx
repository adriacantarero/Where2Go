import { connect } from "react-redux";
import { ResultDetailsPresenter } from "./resultDetailsPresenter";

// Import action creators
import { clearSelectionAction } from "/src/app/features/dashboard/dashboardThunks";
import { addPoiToItinerary } from "/src/app/features/itinerary/itinerarySlice";

// Import Selectors
import { selectDetails, selectDetailsLoading, selectDetailsError } from "/src/app/features/dashboard/resultDetailsSlice";

function ResultDetailsContainer(props) {
    // Pass redux-props to presenter
    return <ResultDetailsPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    // Selection state (state.resultDetails based on rootReducer)
    const details = selectDetails(state);

    // We access current itinerary to check if this place is already added
    const currentItinerary = state.itinerary.current;
    const currentItineraryPois = state.itinerary.current.pois || [];
    const isAdded = currentItineraryPois.some(poi => poi.id === details?.id);

    return {
        // Selected place details
        details: details,

        // Flag indicating if the place is already added to itinerary
        isAdded: isAdded,

        // Loading and error state
        isLoading: selectDetailsLoading(state),
        error: selectDetailsError(state),

        // Dates of the current itinerary
        tripStart: currentItinerary.startDate,
        tripEnd: currentItinerary.endDate,
    };
}

// Map Redux-actions to Props
function mapDispatch(dispatch) {
    return {
        onBack: () => dispatch(clearSelectionAction()),
        savePoiToStore: (poi) => dispatch(addPoiToItinerary(poi))
    };
}

// Sync presenter with Redux state
export const ResultDetails = connect(mapState, mapDispatch)(ResultDetailsContainer);