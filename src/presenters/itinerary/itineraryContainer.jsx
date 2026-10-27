import { connect } from "react-redux";
import { ItineraryPresenter } from "./itineraryPresenter";

// Import action creators and thunks
import { setModalOpen } from "/src/app/features/core/coreSlice";
import { 
    createItinerary, addPoiToItinerary, removePoiToItinerary, 
    setCurrentItineraryTitle, requestedSavingItinerary, requestedDeletingItinerary, 
    selectItinerary, clearItinerary, updatePoiDate
} from "/src/app/features/itinerary/itinerarySlice";
import { setTitle, setDestinationCity, setDepartureDate, setReturnDate, resetSearch, snapshotHomeSearch } from "/src/app/features/search/searchSlice";
import { searchPlacesAction, selectPlaceAction, clearSelectionAction } from "/src/app/features/dashboard/dashboardThunks";
import { loginWithGoogle } from "/src/app/features/auth/authThunks";
import { clearResults, selectResults } from "/src/app/features/dashboard/resultSlice";

function ItineraryContainer(props) {
    // Pass redux-props to presenter
    return <ItineraryPresenter {...props} />;
}

// Map Redux state to props
function mapState(state){
    return {
        user: state.auth.user, //To know if there is logged user or guest user.
        currentItinerary: state.itinerary.current,
        itineraries: state.itinerary.itineraries,
        error: state.itinerary.error,
        isDetailsOpen: state.resultDetails.placeId !== null,
        hasMapResults: !!selectResults(state),
    };
}

// Map Redux-actions to Props
function mapDispatch(dispatch){
    return {
        loginWithGoogle: () => dispatch(loginWithGoogle()),

        onCreateItinerary: () => dispatch(createItinerary()),
        onAddPoi: (poi) => dispatch(addPoiToItinerary(poi)),
        onRemovePoi: (poiId) => dispatch(removePoiToItinerary(poiId)),
        onRenameItinerary: (title) => dispatch(setCurrentItineraryTitle(title)),
        onRequestSavingItinerary: () => dispatch(requestedSavingItinerary()),
        onRequestDeleteItinerary: () => dispatch(requestedDeletingItinerary()),
        
        // When selecting an itinerary, we also clear the place selection
        onSelectItinerary: (id) => {
            dispatch(selectItinerary(id));
            dispatch(clearSelectionAction());
            dispatch(clearResults());
        },
        onClearItinerary: () => dispatch(clearItinerary()),
        
        onSetModalOpen: (isOpen) => dispatch(setModalOpen(isOpen)),

        onClearSearchForm: () => {
            dispatch(resetSearch());
            dispatch(clearSelectionAction());
        },

        snapshotHomeSearch: () => dispatch(snapshotHomeSearch()),

        onLoadPlacesForCurrentItinerary: (currentItinerary, hasMapResults) => {
            // IF map is already loaded for this session, skip fetching
            if (hasMapResults) return;

            const dest = currentItinerary?.tripDestination;
            if (!dest?.lat) return;
            
            // Sync state data
            dispatch(setDestinationCity(dest));
            dispatch(setTitle(currentItinerary?.title || ""));
            dispatch(setDepartureDate(currentItinerary?.startDate || null));
            dispatch(setReturnDate(currentItinerary?.endDate || null));

            // Trigger map search
            const offset = 0.05;
            const bounds = `${dest.lon - offset},${dest.lat - offset},${dest.lon + offset},${dest.lat + offset}`;

            dispatch(clearResults());
            dispatch(clearSelectionAction());
            dispatch(searchPlacesAction(bounds));
        },

        // Select a place to show details
        onSelectPlace: (id) => dispatch(selectPlaceAction(id, 'itinerary')),

        // Action to move POI to a new date
        onMovePoi: (id, newDate) => dispatch(updatePoiDate({ id, newDate })),
    };
}

// Sync presenter with Redux state
export const Itinerary = connect(mapState, mapDispatch)(ItineraryContainer);